// pages/schedule/schedule.js
const app = getApp();

const ALL_SLOTS = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

Page({
  data: {
    stylists: [],
    currentBarberId: 'stylist_007',
    upcomingDays: [],
    selectedDate: '',
    slots: []
  },

  onLoad() {
    this.setData({
      stylists: app.globalData.stylists
    });
    this.initDates();
    this.refreshSchedule();
  },

  onShow() {
    if (app.globalData.selectedDate && app.globalData.selectedDate !== this.data.selectedDate) {
      this.setData({ selectedDate: app.globalData.selectedDate });
    }
    this.refreshSchedule();
  },

  initDates() {
    const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const days = [];
    const now = new Date();
    const baseYear = now.getFullYear();
    const baseMonth = now.getMonth();
    const baseDate = now.getDate();

    for (let i = 0; i < 7; i++) {
      // 纯年月日安全运算
      const target = new Date(baseYear, baseMonth, baseDate + i);
      const y = target.getFullYear();
      const m = String(target.getMonth() + 1).padStart(2, '0');
      const d = String(target.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      let rel = i === 0 ? '今天' : i === 1 ? '明天' : i === 2 ? '后天' : weekMap[target.getDay()];

      days.push({
        dateStr,
        dayNumber: target.getDate(),
        month: target.getMonth() + 1,
        dayOfWeek: weekMap[target.getDay()],
        relativeLabel: rel
      });
    }

    const defaultDate = app.globalData.selectedDate || days[0].dateStr;
    app.globalData.selectedDate = defaultDate;

    this.setData({
      upcomingDays: days,
      selectedDate: defaultDate
    });
  },

  switchBarber(e) {
    this.setData({
      currentBarberId: e.currentTarget.dataset.id || 'stylist_007'
    }, () => {
      this.refreshSchedule();
    });
  },

  onSelectDate(e) {
    const date = e.currentTarget.dataset.date;
    app.globalData.selectedDate = date;
    this.setData({
      selectedDate: date
    }, () => {
      this.refreshSchedule();
    });
  },

  async refreshSchedule() {
    const { currentBarberId, selectedDate } = this.data;
    let appointments = [];
    let daySchedule = {};

    try {
      if (app.db) {
        // 1. 查询云端顾客预约记录
        const apptRes = await app.db.collection('appointments').where({
          stylistId: currentBarberId,
          date: selectedDate,
          status: 'confirmed'
        }).get();
        appointments = apptRes.data || [];

        // 2. 查询云端排班设置
        const scheduleKey = `${currentBarberId}_${selectedDate}`;
        const schedRes = await app.db.collection('schedules').doc(scheduleKey).get().catch(() => null);
        if (schedRes && schedRes.data && schedRes.data.slots) {
          daySchedule = schedRes.data.slots;
        }
      }
    } catch (e) {
      console.warn('云端排班获取失败，读取本地备用数据:', e);
    }

    // 本地缓存备份回退
    if (appointments.length === 0) {
      const localAppts = wx.getStorageSync('barbershop_appointments') || [];
      appointments = localAppts.filter(a => a.stylistId === currentBarberId && a.date === selectedDate && a.status === 'confirmed');
    }
    if (Object.keys(daySchedule).length === 0) {
      const schedules = wx.getStorageSync('barbershop_schedules') || {};
      daySchedule = schedules[`${currentBarberId}_${selectedDate}`] || {};
    }

    const slots = ALL_SLOTS.map(time => {
      const appt = appointments.find(a => a.timeSlot === time);
      if (appt) {
        return {
          time,
          status: 'booked',
          customerInfo: `${appt.customerName} (${appt.serviceName})`
        };
      }

      const isUnavailable = daySchedule[time] === 'unavailable';
      return {
        time,
        status: isUnavailable ? 'unavailable' : 'available'
      };
    });

    this.setData({ slots });
  },

  async toggleSlot(e) {
    const { time, status } = e.currentTarget.dataset;
    if (status === 'booked') {
      wx.showToast({ title: '该时段已有预约', icon: 'none' });
      return;
    }

    const { currentBarberId, selectedDate } = this.data;
    const scheduleKey = `${currentBarberId}_${selectedDate}`;
    const newStatus = status === 'available' ? 'unavailable' : 'available';

    // 1. 本地立即更新
    const schedules = wx.getStorageSync('barbershop_schedules') || {};
    if (!schedules[scheduleKey]) {
      schedules[scheduleKey] = {};
    }
    schedules[scheduleKey][time] = newStatus;
    wx.setStorageSync('barbershop_schedules', schedules);
    this.refreshSchedule();

    // 2. 云端实时同步写入
    try {
      if (app.db) {
        await app.db.collection('schedules').doc(scheduleKey).set({
          data: {
            stylistId: currentBarberId,
            date: selectedDate,
            slots: schedules[scheduleKey],
            updatedAt: new Date()
          }
        });
        console.log('云端排班保存成功:', scheduleKey);
      }
    } catch (err) {
      console.warn('云端写入排班提示：', err);
    }

    wx.showToast({
      title: newStatus === 'available' ? '已设为【有空·开放】' : '已设为【没空·休息】',
      icon: 'success'
    });
  },

  async batchSet(e) {
    const type = e.currentTarget.dataset.type;
    const { currentBarberId, selectedDate } = this.data;
    const scheduleKey = `${currentBarberId}_${selectedDate}`;
    const newSlots = {};

    ALL_SLOTS.forEach(slot => {
      newSlots[slot] = type === 'all_open' ? 'available' : 'unavailable';
    });

    // 1. 本地更新
    const schedules = wx.getStorageSync('barbershop_schedules') || {};
    schedules[scheduleKey] = newSlots;
    wx.setStorageSync('barbershop_schedules', schedules);
    this.refreshSchedule();

    // 2. 云端批量更新
    try {
      if (app.db) {
        await app.db.collection('schedules').doc(scheduleKey).set({
          data: {
            stylistId: currentBarberId,
            date: selectedDate,
            slots: newSlots,
            updatedAt: new Date()
          }
        });
      }
    } catch (err) {
      console.warn('云端批量更新提示:', err);
    }

    wx.showToast({
      title: type === 'all_open' ? '全天已设为有空' : '全天已设为休息',
      icon: 'success'
    });
  }
});
