// app.js
App({
  onLaunch() {
    console.log('简剪理发预约微信小程序启动');

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

    // 2. 本地备用缓存初始化（保证未配置云开发时也能无缝使用）
    this.initLocalDataFallback();
  },

  initLocalDataFallback() {
    if (!wx.getStorageSync('barbershop_appointments')) {
      wx.setStorageSync('barbershop_appointments', [
        {
          id: 'apt_1001',
          bookingCode: 'B8291',
          customerName: '张先生',
          customerPhone: '138****6672',
          stylistId: 'stylist_tony',
          stylistName: 'Tony 老师',
          serviceName: '总监设计洗剪吹',
          servicePrice: 68,
          date: '2026-10-23',
          timeSlot: '11:00',
          status: 'confirmed',
          createdAt: '2026-10-22 14:20'
        }
      ]);
    }
  },

  globalData: {
    userInfo: null,
    stylists: [
      { id: 'stylist_tony', name: 'Tony 老师', title: '首席发型总监', exp: '9年发龄' },
      { id: 'stylist_lily', name: 'Lily 设计师', title: '资深美发设计师', exp: '7年发龄' },
      { id: 'stylist_ming', name: '阿铭 匠师', title: '美式复古理容主理人', exp: '14年发龄' }
    ]
  }
});
