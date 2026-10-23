// pages/index/index.js
const app = getApp();

const ALL_SLOTS = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

Page({
  data: {
    stylists: [],
    selectedStylistId: 'stylist_tony',
    selectedStylistName: 'Tony 老师',
    upcomingDays: [],
    selectedDate: '',
    services: [
      { id: 'srv_1', name: '总监设计洗剪吹', duration: 45, price: 68 },
      { id: 'srv_2', name: '复古热敷修面 + 剪发', duration: 60, price: 118 },
      { id: 'srv_3', name: '日系自然纹理烫发', duration: 90, price: 288 }
    ],
    selectedServiceId: 'srv_1',
    timeSlots: [],
    selectedSlot: null,
    customerName: '陈先生',
    customerPhone: '13812345678',
    showTopNotice: false,
    latestNotice: null,
    isCloudReady: false
  },

  onLoad() {
    this.setData({
      stylists: app.globalData.stylists
    });
    this.initDates();
    this.checkCloudStatus();
    this.refreshSlots();
  },

  onShow() {
    this.refreshSlots();
  },

  checkCloudStatus() {
    if (wx.cloud && app.db) {
      this.setData({ isCloudReady: true });
    }
  },

  initDates() {
    const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const days = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const target = new Date();
      target.setDate(now.getDate() + i);
      const y = target.getFullYear();
      const m = String(target.getMonth() + 1).padStart(2, '0');
      const d = String(target.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      let rel = i === 0 ? '今天' : i === 1 ? '明天' : i === 2 ? '后天' : weekMap[target.getDay()];

      days.push({
        dateStr,
        dayNumber: target.getDate(),
        dayOfWeek: weekMap[target.getDay()],
        relativeLabel: rel
      });
    }

    this.setData({
      upcomingDays: days,
      selectedDate: days[0].dateStr
    });
  },

  onSelectStylist(e) {
    const id = e.currentTarget.dataset.id;
    const s = this.data.stylists.find(item => item.id === id);
    this.setData({
      selectedStylistId: id,
      selectedStylistName: s ? s.name : '',
      selectedSlot: null
    }, () => {
      this.refreshSlots();
    });
  },

  onSelectDate(e) {
    const date = e.currentTarget.dataset.date;
    this.setData({
      selectedDate: date,
      selectedSlot: null
    }, () => {
      this.refreshSlots();
    });
  },

  onSelectService(e) {
    this.setData({
      selectedServiceId: e.currentTarget.dataset.id
    });
  },

  // 从微信云开发数据库加载档期与预约状态（若未创建集合则自动回退至本地存储）
  async refreshSlots() {
    const { selectedStylistId, selectedDate } = this.data;
    let appointments = [];
    let daySchedule = {};

    try {
      if (app.db) {
        // 1. 查询云数据库中当日已预约的时段
        const apptRes = await app.db.collection('appointments').where({
          stylistId: selectedStylistId,
          date: selectedDate,
          status: 'confirmed'
        }).get();
        appointments = apptRes.data || [];

        // 2. 查询云数据库中理发师设定的档期有空/没空状态
        const scheduleKey = `${selectedStylistId}_${selectedDate}`;
        const schedRes = await app.db.collection('schedules').doc(scheduleKey).get().catch(() => null);
        if (schedRes && schedRes.data && schedRes.data.slots) {
          daySchedule = schedRes.data.slots;
        }
      }
    } catch (err) {
      console.warn('云数据库读取异常，使用本地缓存：', err);
    }

    // 回退机制：若云开发暂未建集合，合并本地缓存
    if (appointments.length === 0) {
      const localAppts = wx.getStorageSync('barbershop_appointments') || [];
      appointments = localAppts.filter(a => a.stylistId === selectedStylistId && a.date === selectedDate && a.status === 'confirmed');
    }
    if (Object.keys(daySchedule).length === 0) {
      const schedules = wx.getStorageSync('barbershop_schedules') || {};
      daySchedule = schedules[`${selectedStylistId}_${selectedDate}`] || {};
    }

    const slots = ALL_SLOTS.map(time => {
      // 1. 是否已被预约
      const isBooked = appointments.some(a => a.timeSlot === time);
      if (isBooked) {
        return { time, status: 'booked', label: '已约满' };
      }

      // 2. 理发师是否设置休息/没空
      const isUnavailable = daySchedule[time] === 'unavailable';
      if (isUnavailable) {
        return { time, status: 'unavailable', label: '休息中' };
      }

      return { time, status: 'available', label: '可预约' };
    });

    this.setData({ timeSlots: slots });
  },

  onSelectSlot(e) {
    const { time, status } = e.currentTarget.dataset;
    if (status !== 'available') {
      wx.showToast({
        title: status === 'booked' ? '此时段已被预约' : '理发师此时段休息',
        icon: 'none'
      });
      return;
    }
    this.setData({ selectedSlot: time });
  },

  onInputName(e) {
    this.setData({ customerName: e.detail.value });
  },

  onInputPhone(e) {
    this.setData({ customerPhone: e.detail.value });
  },

  hideTopNotice() {
    this.setData({ showTopNotice: false });
  },

  async submitBooking() {
    const { customerName, customerPhone, selectedStylistId, selectedStylistName, selectedDate, selectedSlot, selectedServiceId, services } = this.data;
    if (!customerName || !customerPhone) {
      wx.showToast({ title: '请填写姓名和手机', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '提交云端预约中...' });

    const srv = services.find(s => s.id === selectedServiceId) || services[0];
    const bookingCode = 'B' + Math.floor(1000 + Math.random() * 9000);
    const newAppointment = {
      bookingCode,
      customerName,
      customerPhone,
      stylistId: selectedStylistId,
      stylistName: selectedStylistName,
      serviceName: srv.name,
      servicePrice: srv.price,
      date: selectedDate,
      timeSlot: selectedSlot,
      status: 'confirmed',
      createdAt: new Date().toLocaleString(),
      notificationHistory: [
        {
          id: 'notif_' + Date.now(),
          title: '服务预约成功通知',
          sentAt: new Date().toLocaleTimeString(),
          bookingCode
        }
      ]
    };

    // 1. 尝试写入微信云数据库
    let cloudSuccess = false;
    try {
      if (app.db) {
        const res = await app.db.collection('appointments').add({
          data: newAppointment
        });
        if (res && res._id) {
          newAppointment.id = res._id;
          cloudSuccess = true;
          console.log('云数据库写入成功，ID:', res._id);
        }
      }
    } catch (e) {
      console.warn('云开发写入警告，同步至本地备用存储:', e);
    }

    if (!cloudSuccess) {
      newAppointment.id = 'apt_' + Date.now();
    }

    // 2. 本地缓存备份同步
    const list = wx.getStorageSync('barbershop_appointments') || [];
    list.unshift(newAppointment);
    wx.setStorageSync('barbershop_appointments', list);

    wx.hideLoading();

    // 3. 触发顶部微信服务通知弹窗提示，并保存到记录
    this.setData({
      showTopNotice: true,
      latestNotice: newAppointment,
      selectedSlot: null
    });

    // 4. 实时刷新档期状态
    this.refreshSlots();

    wx.showToast({ title: '预约成功！', icon: 'success' });

    // 6秒后自动淡出顶部弹窗
    setTimeout(() => {
      this.setData({ showTopNotice: false });
    }, 6000);
  }
});
