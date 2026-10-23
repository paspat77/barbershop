// app.js
App({
  onLaunch() {
    console.log('简剪理发预约微信小程序启动 - 主理发型师: 007');

    // 1. 初始化微信云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      // 填入您在微信开发者工具点击「云开发」开通后获取的环境ID (如: cloud1-xxxxxx)
      // 若留空将默认使用第一个当前可用环境
      const CLOUD_ENV_ID = ''; 

      wx.cloud.init({
        env: CLOUD_ENV_ID || undefined,
        traceUser: true,
      });

      this.db = wx.cloud.database();
    }

    // 2. 本地备用缓存初始化（动态绑定当天日期，保证真机与开发者工具显示完全一致）
    this.initLocalDataFallback();
  },

  // 获取 YYYY-MM-DD 格式的安全本地日期
  getFormattedDate(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  initLocalDataFallback() {
    const now = new Date();
    const todayStr = this.getFormattedDate(now);
    this.globalData.todayStr = todayStr;

    // 清理或更新至包含 007 的预约测试数据
    const existingAppts = wx.getStorageSync('barbershop_appointments');
    const has007 = existingAppts && existingAppts.some(a => a.stylistId === 'stylist_007');

    if (!has007) {
      wx.setStorageSync('barbershop_appointments', [
        {
          id: 'apt_1001',
          bookingCode: 'B8007',
          customerName: '邦德先生',
          customerPhone: '138****0077',
          stylistId: 'stylist_007',
          stylistName: '007',
          serviceName: '总监设计洗剪吹',
          servicePrice: 68,
          date: todayStr,
          timeSlot: '11:00',
          status: 'confirmed',
          createdAt: `${todayStr} 09:30`
        }
      ]);
    }
  },

    globalData: {
    userInfo: null,
    shopName: 'BT100',
    shopAddress: '深圳市宝安区壆岗大道围浅楼37号',
    // 按照需求：仅保留1位理发师，名称007，留言：never joke about my work, 007；发龄20年
    stylists: [
      {
        id: 'stylist_007',
        name: '007',
        title: '特工发艺主理人 · 造型宗师',
        exp: '20年发龄',
        bio: 'never joke about my work, 007'
      }
    ],
    selectedDate: ''
  }
});
