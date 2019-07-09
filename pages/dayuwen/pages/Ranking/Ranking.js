var page=1;
var postId;
var pid;
var list_wei = [];
var list_wei02 = [];
const network = require("../../../../utils/main.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selected1: false,
    name:"",
    author:"",
    list:[],
    list_sun:[],
    pid:"",
    pic:"",
    audid:""
  },
  tolangdu:function(e){
    var postadid = e.currentTarget.dataset.id;
    console.log(postadid)
  },
  goting:function(e){
    var postad = e.currentTarget.dataset.postad;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: `/pages/dayuwen/pages/listensun/listen?id=${postad}&name=${name}`
    })
  },
  gorecorder: function (e) {
    var postad = e.currentTarget.dataset.postad;
    var name = e.currentTarget.dataset.name;
    var author = e.currentTarget.dataset.author;
    wx.navigateTo({
      url: `/pages/dayuwen/pages/recorder/recorder?id=${postad}&name=${name}&author=${author}`
    })
  },
  tolangdu:function(e){
    var postad = e.currentTarget.dataset.postad;
    var good = e.currentTarget.dataset.good;
    wx.navigateTo({
      url: "/pages/dayuwen/pages/listen/listen?id=" + postad+"&good="+good
    })
  },
  topshoop: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.goodlist(options)
    this.dealt(options)
    this.Recitation(options)
  },
  goTo: function (e) {
    var postad = e.currentTarget.dataset.postad
    console.log(postad)
    wx.navigateTo({
      url: '/pages/dayuwen/pages/Appreciate/Appreciate?id=' + postad
    })
  },
  dealt: function (options){
     postId = options.id
    var that=this
    wx.request({
      url: 'http://social.test.ajihua888.com/v14/chinese/poetryinfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        // "searchname": name,
        "app_source_type": 1,
        "read_id": postId
      },
      success: function (res) {

        that.setData({
          name: res.data.data[0].item.rname,
          author:  res.data.data[0].item.cname + res.data.data[0].item.readname + ".",
          pid: postId,
          pic: res.data.data[0].item.imgUrl
        })
      }
    })
  },


  selected: function () {
    this.setData({
      selected: true,
      selected1: false
    })
  },
  Recitation: function (options){
    var postId = options.id
    var that = this
    wx.request({
      url: 'http://social.test.ajihua888.com/v14/chinese/myreading',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        // "searchname": name,
        "app_source_type": 1,
        "audio_id": postId
      },
      success: function (res) {
   
        for (var i = 0; i < res.data.data[0].list.length; i++) {
          console.log(typeof list_wei);
          list_wei02.push(res.data.data[0].list[i])
          console.log(res.data.data[0].list[i].id)
        }
        that.setData({
          list_sun: res.data.data[0].list,
          audid: res.data.data[0].list.id
        })
      }
    })
  },
  goodlist: function (options){
   postId = options.id 
    var that=this
    wx.request({
      url: 'http://social.test.ajihua888.com/v14/chinese/praise',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        // "searchname": name,
        "app_source_type": 1,
        "read_id": postId,
        "pagesize":20
      },
      success:function(res){
        for (var i = 0; i < res.data.data[0].list.length; i++) {
          console.log(typeof list_wei);
           list_wei.push(res.data.data[0].list[i])
        }
        that.setData({
          list: res.data.data[0].list
        })
      }
    })
  },
  selected1: function () {
    this.setData({
      selected: false,
      selected1: true
    })
  },
  xiala: function (options){
    wx.showLoading({
      title: '加载中,请稍后',
    })
    page=page+1
    var that = this
    wx.request({
      url: 'http://social.test.ajihua888.com/v14/chinese/praise',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        // "searchname": name,
        "app_source_type": 1,
        "read_id": postId,
        "page": page,
        "pagesize": 20
      },
      success: function (res) {
        console.log(list_wei)
        for (var i = 0; i < res.data.data[0].list.length;i++){
           list_wei.push(res.data.data[0].list[i])
        }
       
        that.setData({
          
          list: list_wei
        })
      }
    })
    wx.hideLoading();
  },



  xiala02: function (options) {
    wx.showLoading({
      title: '加载中,请稍后',
    })
    page = page + 1
    var that = this
    wx.request({
      url: 'http://social.test.ajihua888.com/v14/chinese/myreading',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        // "searchname": name,
        "app_source_type": 1,
        "audio_id": postId,
        "page": page,
        "pagesize": 20
      },
      success: function (res) {
        console.log(res.data.data[0].list)
        for (var i = 0; i < res.data.data[0].list.length; i++) {
          list_wei02.push(res.data.data[0].list[i])
        }

        that.setData({

          list_sun: list_wei02
        })
      }
    })
    wx.hideLoading();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onPromise: function(){

  // },
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