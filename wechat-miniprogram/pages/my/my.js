// pages/my/my.js
const app = getApp();

Page({
  data: {
    appointments: []
  },

  onShow() {
    this.loadAppointments();
  },

  async loadAppointments() {
    let list = [];

    // 1. 优先从微信云数据库读取
    try {
      if (app.db) {
        const res = await app.db.collection('appointments')
          .orderBy('createdAt', 'desc')
          .get();
        if (res.data && res.data.length > 0) {
          list = res.data;
        }
      }
    } catch (e) {
      console.warn('云端记录获取提示:', e);
    }

    // 2. 本地备用缓存合并
    if (list.length === 0) {
      list = wx.getStorageSync('barbershop_appointments') || [];
    }

    this.setData({
      appointments: list
    });
  },

  cancelAppt(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认取消预约',
      content: '取消后该预约时段将重新开放给其他顾客。',
      success: async (res) => {
        if (res.confirm) {
          // 1. 更新云端数据库
          try {
            if (app.db && id.length > 10) {
              await app.db.collection('appointments').doc(id).update({
                data: {
                  status: 'cancelled'
                }
              });
            }
          } catch (err) {
            console.warn('云端更新状态失败，更新本地:', err);
          }

          // 2. 更新本地缓存
          const localList = wx.getStorageSync('barbershop_appointments') || [];
          const updated = localList.map(item => {
            if (item.id === id || item._id === id) {
              return { ...item, status: 'cancelled' };
            }
            return item;
          });
          wx.setStorageSync('barbershop_appointments', updated);

          this.loadAppointments();
          wx.showToast({ title: '已取消预约', icon: 'success' });
        }
      }
    });
  }
});
