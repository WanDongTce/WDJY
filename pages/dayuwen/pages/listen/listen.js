const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()
var flgws=true, timer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    percent: 0,
    text: [],
    duration: 0,
    currentTime: 0,
    currentText: '',
    currentIndex: 0,
    toView: '',
    scrollTop: 100,
    percent: 0,
    lastTime: 0,
    percentTime: '',
    onPlay: true,
    thumbnail: '',
    tabTitle: '',
    flg:true,
    good:""
  },
  suspend:function(){
    if (flgws==true){
      innerAudioContext.pause()
      flgws=false
      this.setData({
        flg: false
      })
    }else{
      innerAudioContext.play()
      flgws = true
      this.setData({
        flg: true
      })
    }
   
  },
  goTo: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dayuwen/pages/recorder/recorder?id=${id}&name=${that.data.name}&author=${that.data.author}`
    })
  },
  timeFormat: function (time) {
    let m = parseInt(time / 60) < 10 ? ("0" + parseInt(time / 60)) : parseInt(time / 60);
    let s = time % 60 < 10 ? ("0" + time % 60) : time % 60;
    return m + ":" + s;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:',options);
    this.empty = this.selectComponent("#empty");
    this.compontNavbar = this.selectComponent("#compontNavbar");
        this.setData({
            tabTitle: "听一听"
        });
    //
    let id = options.id;
    console.log(options.good)
    console.log(app.userInfo);
    this.setData({
      id: id,
      good: options.good
    });
    //
    let title = options.title;
    console.log(id)
    //测试接口数据
    this.loadInit(id);
    //
  },
  loadInit: function(id){
    let that = this;
    wx.request({
      url: 'http://social.test.ajihua888.com/v14/chinese/myreading', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      data: {
        "token": app.userInfo.token,
        "mobile": app.userInfo.mobile,
        "app_source_type": 1,
        audio_id: id
      },
      success(res) {
        console.log('res: ');
        let data = res.data.data[0].item;
        let audioUrl = data.audioUrl;
        let lrcUrl = data.lrcUrl;
        console.log(data.rname)
        that.setData({
          thumbnail: data.imgUrl,
          name: data.rname,
          author: data.readname
        })
        //
        //下载歌词  
        // 判断歌词文件格式 避免导致运行效率
        let isLrc = /.lrc/.test(lrcUrl);
        console.log('isLrc: ',isLrc);
        if(isLrc){
          wx.request({
            url: lrcUrl, //仅为示例，并非真实的接口地址
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              let text = that.parseLyric(res.data)
              console.log(text)
              that.setData({
                text: text
              });
              //
              that.startMusic(audioUrl);
            }
          });
        } else {
          console.log('歌词字幕不是lrc格式');
        }
      }
    });
  },
  startMusic: function (audioUrl) {
    let that = this;
    //绑定音频播放地址
    innerAudioContext.autoplay = true
    innerAudioContext.src = audioUrl;
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.setData({
        duration: innerAudioContext.currentTime
      })
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    });
    //加载音频提示
    innerAudioContext.onWaiting(function(res){
      console.log('加载进度：',res);
    });
    //
    innerAudioContext.onEnded(function(res){
      console.log(res);
      //如果播放结束，停止播放
      console.log('parseInt(innerAudioContext.duration): ',parseInt(innerAudioContext.duration))
      console.log('parseInt(innerAudioContext.currentTime):',parseInt(innerAudioContext.currentTime))
      flgws=false
          that.setData({
            flg: false
          });
          clearTimeout(timer);
          innerAudioContext.destroy()
    });

    innerAudioContext.onTimeUpdate(function () {
      let srcText = that.data.text;
      timer = setTimeout(function () {
        //
        let srcCurrentText = [];
        if (srcText.length) {
          srcCurrentText = srcText.filter(function (item) {
            //之间
            return item[0] < innerAudioContext.currentTime;
          });

          //
        }
        let currentId = 'id' + (srcCurrentText.length - 1);
        let percent = parseInt(innerAudioContext.currentTime) / parseInt(innerAudioContext.duration);
        percent = parseInt(100 * percent);
        let lastTime = parseInt(innerAudioContext.duration) - parseInt(innerAudioContext.currentTime);
        lastTime = that.timeFormat(lastTime);
        let percentTime = that.timeFormat(parseInt(innerAudioContext.currentTime)) + '/' + that.timeFormat(parseInt(innerAudioContext.duration));
        //
        console.log('currentId: ',currentId);
        console.log('that.data.toView: ',that.data.toView)
        if (that.data.toView == currentId) {
          that.setData({
            duration: innerAudioContext.duration,
            currentTime: innerAudioContext.currentTime,
            currentText: srcCurrentText[srcCurrentText.length - 1][1],
            currentIndex: srcCurrentText.length - 1,
            percent,
            lastTime: lastTime,
            percentTime
          })
        } else {
          that.setData({
            duration: innerAudioContext.duration,
            currentTime: innerAudioContext.currentTime,
            currentText: srcCurrentText[srcCurrentText.length - 1][1],
            currentIndex: srcCurrentText.length - 1,
            toView: 'id' + (srcCurrentText.length - 3), //留有一行
            percent,
            lastTime,
            percentTime
          })
        }    
      }, 1000)
    });
  },
  //
  parseLyric: function (text) {

    //将文本分隔成一行一行，存入数组

    var lines = text.split('\n'),

      //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]

      pattern = /\[\d{2}:\d{2}.\d{2}\]/g,

      //保存最终结果的数组

      result = [];

    while (!pattern.test(lines[0])) {
      lines = lines.slice(1);
    };

    lines[lines.length - 1].length === 0 && lines.pop();

    lines.forEach(function (v /*数组元素值*/, i /*元素索引*/, a /*数组本身*/) {

      var time = v.match(pattern),
        value = v.replace(pattern, '');
      time.forEach(function (v1, i1, a1) {
        var t = v1.slice(1, -1).split(':');
        result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
      });
    });
    result.sort(function (a, b) {
      return a[0] - b[0];
    });
    return result;
  },
  //

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.data.onPlay) {
      innerAudioContext.play();
      this.setData({
        onPlay: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // innerAudioContext.pause();
    innerAudioContext.destroy();
    this.setData({
      onPlay: false
    });
    console.log('listen onHide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    innerAudioContext.stop();
    innerAudioContext.destroy();
    console.log('listen onUnload');
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