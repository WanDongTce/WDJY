// pages/confirmend/confirmend.js
const innerAudioContext = wx.createInnerAudioContext();
const app = getApp();
let timerOut = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    duration: 0,
    currentTime: 0,
    lastTime: 0,
    percent: 0,
    tabTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.empty = this.selectComponent("#empty");
    this.compontNavbar = this.selectComponent("#compontNavbar");
        this.setData({
            tabTitle: "录音"
        });
    console.log(options);
    let id = options.id;
    this.setData({
      id
    });
  },
  reset: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  onUpload: function () {
    let filePath = wx.getStorageSync('filePath');
    //上传文件
    this.uploadFile(filePath, this.data.id);
    wx.showToast({
      title: '录制成功',
      icon: 'success',
      duration: 3000
    })
    
  },
  uploadFile: function (filePath, id) {
    wx.uploadFile({
      url: 'http://social.test.ajihua888.com/v14/public/upload', //仅为示例，非真实的接口地址
      filePath: filePath, // 小程序临时文件路径,
      name: '$_FILES',
      success(res) {
        let data = res.data;
        //do something
        data = JSON.parse(data);
        let filelUrl = data.data[0].list[0].file_url;
        console.log(filelUrl);
        console.log(data);
        //记录录音
        wx.request({
          url: 'http://social.test.ajihua888.com/v14/chinese/audio-add', //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method: 'POST',
          data: {
            "token": app.userInfo.token,
            "mobile": app.userInfo.mobile,
            "app_source_type": 1,
            audio_id: id,
            audioUrl: filelUrl
          },
          success(res) {
            console.log(res.data);
          }
        });
        //
      }
    });
  },
  // 258秒 改成2:35格式
  timeFormat: function (time) {
    let m = parseInt(time / 60) < 10 ? ("0" + parseInt(time / 60)) : parseInt(time / 60);
    let s = time % 60 < 10 ? ("0" + time % 60) : time % 60;
    return m + ":" + s;
  },
  startMusic: function (audioUrl) {
    let that = this;
    //绑定音频播放地址
    innerAudioContext.autoplay = true
    innerAudioContext.src = audioUrl
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.setData({
        duration: that.timeFormat(parseInt(innerAudioContext.duration))
      });
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.onTimeUpdate(function () {
      timerOut = setTimeout(function () {
        let percent = parseInt(innerAudioContext.currentTime) / parseInt(innerAudioContext.duration);
        percent = parseInt(100 * percent);
        let lastTime = parseInt(innerAudioContext.duration) - parseInt(innerAudioContext.currentTime);
        lastTime = that.timeFormat(lastTime);
        //
        that.setData({
          duration: that.timeFormat(parseInt(innerAudioContext.duration)),
          currentTime: that.timeFormat(parseInt(innerAudioContext.currentTime)),
          percent,
          lastTime
        });
      }, 1000);
    });
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
    //播放录音
    let filePath = wx.getStorageSync('filePath');
    this.startMusic(filePath);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(timerOut);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(timerOut);
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