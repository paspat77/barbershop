Page({
  data: {
    // 替换为您的线上 HTTPS 网页地址 (需在小程序后台配置业务域名)
    webUrl: 'https://ais-dev-u7oj4taaxhtxlp4updolqy-169169877650.asia-southeast1.run.app'
  },
  onLoad(options) {
    if (options.url) {
      this.setData({
        webUrl: decodeURIComponent(options.url)
      });
    }
  }
});
