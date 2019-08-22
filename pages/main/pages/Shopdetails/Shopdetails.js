const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1
var yucunlisr = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 'all',
    id: '',
    //商家姓名
    name: "55",
    //商家头像
    pic: "",
    address: "",
    num: 0,
    list_sun: [],
    sopid: "",
    imgurl: [],
    type_list: [],
    number_sun: 0,
    shangpu_null: ""

  },
  getcar: function () {
    var that = this;
    network.POST({
      url: 'v13/shop-cart/list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token
      },

      success: function (res) {
        // console.log(app.userInfo.token)
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list.length;
          console.log(a)
          that.setData({
            number_sun: a
          })
        } else {
          wx.showToast({
            title: res.data.message
          });
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },
  topshoop: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  topshoopsun: function () {
    wx.navigateTo({
      // url: '/pages/main/pages/Shopdetails/Shopdetails'  //跳转详情页  切记配置app.json文件 
      url: '/pages/main/pages/car/car'
    })
  },
  addCount: function (e) {

    const index = e.currentTarget.dataset.id;
    let carts = this.data.list_sun;
    let sid = ""
    carts = carts.map(function (item) {
      if (item.id == index) {
        item.cart_num = parseInt(item.cart_num) + 1
        sid = item.s_id
      }

      return item;
    })

    this.setData({
      list_sun: carts
    })
    network.POST({

      url: 'v13/shop-cart/add',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "num": 1,
        "s_id": sid

      },
      success: function (res) {

        wx.hideLoading();

        if (res.data.code == 200) {
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },


  reduce: function (e) {
    const index = e.currentTarget.dataset.id;
    let carts = this.data.list_sun;
    let sid = ""
    carts = carts.map(function (item) {
      if (item.id == index) {
        if (parseInt(item.cart_num) > 0) {
          item.cart_num = parseInt(item.cart_num) - 1
          sid = item.s_id
        }
      }

      return item;
    })

    this.setData({
      list_sun: carts
    })
    network.POST({

      url: 'v13/shop-cart/reduce',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "num": 1,
        "s_id": sid

      },
      success: function (res) {

        wx.hideLoading();

        if (res.data.code == 200) {
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var postId = options.id

    that.setData({
      id: postId
    })
    that.getlist()
    that.shangpin()
    // that.shangpu()



  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getlist: function () {
    var _this = this
    network.POST({
      url: 'v13/bus-shop-goods/bus-info',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "bid": 50,

      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          var inf = res.data.data[0].item
          console.log(inf)
          var list_weix = []
          var type = []

          for (let i = 0; i < inf.images.length; i++) {

            var pbj = { url: inf.images[i].url }
            list_weix.push(pbj)

          }

          for (let i = 0; i < inf.category_list.length; i++) {

            var pbj = { id: inf.category_list[i].id, name: inf.category_list[i].name }
            type.push(pbj)

          }

          _this.setData({
            name: inf.name,
            pic: inf.pic,
            address: inf.address,
            imgurl: list_weix,
            type_list: type
          })

        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },
  shangpu: function (e) {
    var that = this
    network.POST({

      url: 'v14/public/test',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "num": 1,
        "s_id": 32

      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log(res.data.data[0].test)
          that.setData({
            // shangpu_null: res.data.data[0].test
            shangpu_null: res.data.data[0].test
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },
  shangpin: function (page) {
    var _this = this
    network.POST({

      url: 'v13/shop-goods/index',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "bid": 50,
        "page": page


      },

      success: function (res) {

        wx.hideLoading();

        if (res.data.code == 200) {

          var a = res.data.data[0].list;

          for (var i = 0; i < a.length; i++) {
            yucunlisr.push(a[i])
          }
          _this.setData({

            list_sun: yucunlisr
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },
  bttype: function (e) {
    var dataindex = e.currentTarget.dataset.index;
    var dataid = e.currentTarget.dataset.id;
    console.log(dataid)
    if (dataindex == undefined) {
      dataindex = "all"
    }

    var _this = this
    network.POST({

      url: 'v13/shop-goods/index',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "bid": 50,
        "cb_id": dataid

      },
      success: function (res) {

        wx.hideLoading();

        if (res.data.code == 200) {

          var a = res.data.data[0].list;

          console.log(res.data.message)
          _this.setData({
            list: a,
            list_sun: a,
            currentTab: dataindex
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getcar()
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
    page = page + 1
    this.shangpin(page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})