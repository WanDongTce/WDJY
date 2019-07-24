const network = require("../../../../utils/main.js");
const app = getApp();

Page({
    data: {
        base: '../../../../',
        IMGURL: app.imgUrl,
        number:0
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
      this.getlist()
    },
  getlist: function () {
    var that = this
    wx.request({
      url: 'https://social.ajihua888.com/v14/public/test',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        "app_source_type": app.app_source_type,
      },
      success: function (res) {
        console.log(res.data.data[0].test)
        that.setData({
          number: res.data.data[0].test
        })
      }
    })
  }

})