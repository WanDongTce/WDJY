const network = require("../../../../utils/main.js");
const app = getApp();
var lishi=[]
var gametype=""
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
  topshoop: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function () {
    this.getList()
  },
  changeData: function (historyArr) {
    let _this = this;
    this.loadList();
  },
  onshow: function () {
    this.onLoad();
  },

  getList:function(){
    var list = wx.getStorageSync("lishi")
    console.log(list)
    this.setData({
      list: list
    })
    console.log(list)
  },
  search:function(){
    var gametype_sun = wx.getStorageSync("gametype")
    var name = this.data.searchval
    console.log(name)
    var num=0
    if (lishi.length>0){
      console.log(lishi.length)
      for (var i = 0; i < lishi.length;i++){
        if (gametype_sun == lishi[i].gametype_sun && name == lishi[i].name){
          num++
        }else{
         
         
        }
      }
      if(num>0){

      }else{
        lishi.push({ "name": name, "gametype_sun": gametype_sun })
      }
    }else{
      lishi.push({ "name": name, "gametype_sun": gametype_sun })
    }
   
    wx.setStorageSync("lishi", lishi)
    if (name == undefined){
    }else{
      wx.navigateTo({
        url: '/pages/home/pages/game/gameList/gameList?name=' + name + '&gametype=' + gametype
      })
     
    }
    
  },
  tosearch:function(e){
    var name = e.currentTarget.dataset.name
    var gametype = e.currentTarget.dataset.gametype
    wx.setStorageSync("gametype", gametype)
    wx.navigateTo({
      url: '/pages/home/pages/game/gameList/gameList?name=' + name + '&gametype=' + gametype
    })
    console.log(name)
  },
  searchval: function (e) {
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