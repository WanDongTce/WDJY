Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
   this.getlist()
    
  },
  changeData: function (historyArr) {
    let _this = this;
    this.loadList();
  },
  onshow: function () {
    this.onLoad();
  },
  del:function(){
   var that=this
    wx.request({
      url: 'http://social.test.ajihua888.com/v14/chinese/keyword-del',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',

      data: {
        "token": "88f088f47e2c735e3944e840292e1266",
        "mobile": 18640341140,
        "app_source_type": 1,
      },
      success: function (res) {
       
        that.getlist()
      }
    })
  },
  
  search:function(){
    var name = this.data.searchval
    if (name == undefined){
    }else{
      wx.navigateTo({
        url: '/pages/songdetail/songdetail?name=' + name
      })
    }
    
  },
  tosearch:function(e){
    var name = e.currentTarget.dataset.name
    console.log(name)
    wx.navigateTo({
      url: '/pages/songdetail/songdetail?name=' + name
    })
  },
  getlist:function(){
    var that =this;
    wx.request({
      url: 'http://social.test.ajihua888.com/v14/chinese/mysearchlist',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
     
      method: 'POST',
      data:{
        "token": "e6b5bf2e8d749f32370e76091bc80ae9",
        "mobile": 18640341140,
        "app_source_type": 1,
      },
      success: function (res){
        console.log(res.data.data[0].list)
        that.setData({
         list: res.data.data[0].list
       })
      }
    })
  },
  searchval:function(e){
    this.data.searchval = e.detail.value;
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
    this.onLoad()
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