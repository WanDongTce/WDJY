Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:""
  },
  dealt: function (options) {
    var postId = options.id
    var that = this
    console.log(options)
    wx.request({
      url: 'http://social.test.ajihua888.com/v14/chinese/poetryinfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        "token": "88f088f47e2c735e3944e840292e1266",
        "mobile": 18640341140,
        // "searchname": name,
        "app_source_type": 1,
        "read_id": postId
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          text: res.data.data[0].item.translation,
          
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dealt(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})