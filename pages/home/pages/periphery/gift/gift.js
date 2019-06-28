const network = require("../../../../../utils/main.js");
const app = getApp();
var len = 0;

Math.formatFloat = function (f, digit) {
    var m = Math.pow(10, digit);
    return parseInt(f * m, 10) / m;
}

Page({
    data: {
        checkedList: [],
        list: [{
            "id": "2",
            "name": "测试商家2",
            "pic": "2",
            "goods_list": [
                {
                    "id": "1224",
                    "g_id": "494",
                    "s_id": "489",
                    "price": 0.01,
                    "num": 2,
                    "title": "半梅干半边酸甜话梅200g罐装 情人梅果干果脯蜜饯休闲零食",
                    "image": "http://img.ajihua888.com//upload/2018/05/17/c59b6896809e93f00f97bb4e3c54cf7f.jpg",
                    "total": 0.02,
                    "error": ""
                }
            ]
        },{
            "id": "1",
            "name": "测试商家1",
            "pic": "http://img.test.ajihua888.com/upload/2019/03/07/66885fca01cca741f3b4fa6b046a2893.jpg",
            "goods_list": [
                {
                    "id": "1223",
                    "g_id": "518",
                    "s_id": "513",
                    "price": 13.88,
                    "num": 1,
                    "title": "百货家庭厨房日用品",
                    "image": "http://img.ajihua888.com//upload/2018/05/19/04061277ef44b80a5c92cd9e980df07a.jpg",
                    "total": 13.88,
                    "error": ""
                },
                {
                    "id": "1212",
                    "g_id": "517",
                    "s_id": "512",
                    "price": 8.79,
                    "num": 2,
                    "title": "居家居生活用品",
                    "image": "http://img.ajihua888.com//upload/2018/05/19/899a87301f813cf61d4a4291408bf07d.jpg",
                    "total": 17.58,
                    "error": ""
                }
            ]
        }],
        showEmpty: false,
        priceAll: 0,
        isAll: true,
        cartCount: 0,
        url: '',
        editIndex: 0,
        delBtnWidth: 60
    },
    onLoad: function (options) {
        this.empty = this.selectComponent("#empty");
        this.peripheryBotmTab = this.selectComponent("#peripheryBotmTab");
        this.compontNavbar = this.selectComponent("#compontNavbar");
        // console.log(options)

    },
    onShow: function () {
        //测试数据
        var a = this.data.list;
        var b = [];
        var cartCount = 0;
                    if (a.length > 0) {
                        for (var i = 0; i < a.length; i++) {
                            a[i].checked = true;
                            for (var j = 0; j < a[i].goods_list.length; j++) {
                                a[i].goods_list[j].checked = true;
                                cartCount += a[i].goods_list[j].num;
                                b.push(a[i].goods_list[j].id);
                            }
                        }
                    }
            this.setData({
                list: a,
                checkedList: b,
                showEmpty: a.length == 0 ? true : false,
                isAll: a.length == 0 ? false : true,
                priceAll: Math.formatFloat(this.getTotalPrice(a), 2),
                cartCount
            });
        //暂时用本地数据测试，本方法以下代码暂时
        // var that = this;
        // console.log(wx.getStorageSync('list'));
        // if(wx.getStorageSync('list')){
        //     var a = wx.getStorageSync('list')
        //     var b = [];
        //             if (a.length > 0) {
        //                 for (var i = 0; i < a.length; i++) {
        //                     a[i].checked = true;
        //                     for (var j = 0; j < a[i].goods_list.length; j++) {
        //                         a[i].goods_list[j].checked = true;
        //                         b.push(a[i].goods_list[j].id);
        //                     }
        //                 }
        //             }
        //     that.setData({
        //         list: a,
        //         checkedList: b,
        //         showEmpty: a.length == 0 ? true : false,
        //         isAll: a.length == 0 ? false : true,
        //         priceAll: Math.formatFloat(that.getTotalPrice(a), 2)
        //     });
        // } else {
        //     that.getList();
        // }
        // if(wx.getStorageSync('cartCount')){
        //     that.setData({
        //         cartCount: wx.getStorageSync('cartCount')
        //     })
        // }else {
        //     that.getCartCount();
        // }       
    },
    selectGoods: function (e) {
        var that = this;
        var isAll = null;
        var priceAll = null;
        var idx = e.currentTarget.dataset.index;
        var clist = that.data.checkedList;
        var list = that.data.list;

        // console.log(list[idx]);
        list[idx].checked = !list[idx].checked;
        for (var i = 0; i < list[idx].goods_list.length; i++) {
            var id = list[idx].goods_list[i].id;
            list[idx].goods_list[i].checked = list[idx].checked;
            if (list[idx].goods_list[i].checked) {
                clist.push(id);
            } else {
                clist = clist.filter((item) => {
                    // console.log(item)
                    if (item != id) return item;
                });
            }
        }
        //去重
        clist = Array.from(new Set(clist))
        console.log('clist:  ',Array.isArray(clist))
        //
        len = this.getAllLength()
        console.log('clist.length: ',clist.length)
        isAll = clist.length == len ? true : false;
        priceAll = that.getTotalPrice(list);

        //购物车选中商品数
        var cartCount = that.modifyAllCount(list);
        that.setData({
            list: list,
            checkedList: clist,
            priceAll: Math.formatFloat(priceAll, 2),
            isAll: isAll,
            cartCount
        });
    },
    //修改结算商品总数
    modifyAllCount: function(data){
        var cartCount = 0;
        data.map(function(item){
            item.goods_list.map(function(iitem){
                if(iitem.checked){
                    cartCount += iitem.num
                }
            });
        });
        return cartCount;
    },
    selectGoods_new: function (e) {
        var that = this;
        var a = e.currentTarget.dataset;
        var clist = that.data.checkedList;
        var list = that.data.list;
        var count = 0;
        var priceAll = null;
        var isAll = null;
        var id = list[a.idx].goods_list[a.index].id;

        list[a.idx].goods_list[a.index].checked = !list[a.idx].goods_list[a.index].checked;
        if (list[a.idx].goods_list[a.index].checked) {
            clist.push(id);
            for (var i = 0; i < list[a.idx].goods_list.length; i++) {
                if (list[a.idx].goods_list[i].checked) {
                    count++;
                }
            }
            if (count == list[a.idx].goods_list.length) {
                list[a.idx].checked = true;
            }
        } else {
            list[a.idx].checked = false;
            clist = clist.filter((item) => {
                if (item != id) return item;
            });
        }
        //
        len = this.getAllLength()
        //
        isAll = clist.length == len ? true : false;
        priceAll = that.getTotalPrice(list);
        //购物车选中商品数
        var cartCount = that.modifyAllCount(list);

        that.setData({
            list: list,
            checkedList: clist,
            priceAll: Math.formatFloat(priceAll, 2),
            isAll: isAll,
            cartCount
        });
    },
    getAllLength() {
        var list = this.data.list;
        len = 0;
        //获取所有商品个数
        for (var j = 0; j < list.length; j++) {
            // console.log(list[j]);
            len += list[j].goods_list.length;
        }
        console.log('len: ',len);
        return len;
    },
    getTotalPrice(list) {
        var that = this;
        var a = 0;
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < list[i].goods_list.length; j++) {
                if (list[i].goods_list[j].checked) {
                    a += list[i].goods_list[j].total;
                }
            }
        }
        return a;
    },
    switchAll() {
        var that = this;
        var isAll = that.data.isAll;
        var list = that.data.list;
        var a = 0;
        var b = [];

        for (var i = 0; i < list.length; i++) {
            list[i].checked = !isAll;
            for (var j = 0; j < list[i].goods_list.length; j++) {
                list[i].goods_list[j].checked = !isAll;
                if (!isAll) {
                    a += list[i].goods_list[j].total;
                    b.push(list[i].goods_list[j].id);
                }
            }
        }

        //购物车选中商品数
        var cartCount = that.modifyAllCount(list);
        
        that.setData({
            list: list,
            checkedList: b,
            priceAll: Math.formatFloat(a, 2),
            isAll: !isAll,
            cartCount
        });
    },
    getList: function () {
        var that = this;
        network.POST({
            url: 'v13/shop-cart/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    console.log(res.data.data)
                    var a = res.data.data[0].list;
                    var b = [];
                    if (a.length > 0) {
                        for (var i = 0; i < a.length; i++) {
                            a[i].checked = true;
                            for (var j = 0; j < a[i].goods_list.length; j++) {
                                a[i].goods_list[j].checked = true;
                                b.push(a[i].goods_list[j].id);
                            }
                        }
                    }
                    that.setData({
                        list: a,
                        checkedList: b,
                        showEmpty: a.length == 0 ? true : false,
                        isAll: a.length == 0 ? false : true,
                        priceAll: Math.formatFloat(that.getTotalPrice(a), 2)
                    });
                    // 本地存储
                    wx.setStorageSync('list',a);
                    //
                    that.getAllLength();
                    // console.log(that.data.list)
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
    updateNum(id, num) {
        var that = this;
        //修改本地购物车数据
        var sourceData = that.data.list;
        var cartCount = 0;
        //
        var updateList = sourceData.map(function(item){
            item.goods_list = item.goods_list.map(function(iitem){
                if(iitem.id==id){
                    iitem.num = num;
                    iitem.total = iitem.num * iitem.price;
                }
                if(iitem.checked){
                    cartCount += iitem.num
                }
                return iitem;
            });
            return item;
        });
        //
        // var updateList = sourceData[0].goods_list.map(function(item){
        //     if(item.id==id){
        //         item.num = num;
        //         item.total = item.num * item.price;
        //     }
        //     cartCount += item.num;
        //     return item;
        // });
        // sourceData[0].goods_list = updateList
        console.log(updateList);
        sourceData = updateList;
        var allCount = that.getTotalPrice(sourceData);
        wx.setStorageSync('list', sourceData);
        wx.setStorageSync('cartCount', cartCount)
        that.setData({
            list: sourceData,
            priceAll: Math.formatFloat(allCount, 2),
            cartCount: cartCount
        });
        
        /** 
        network.POST({
            url: 'v13/shop-cart/up-num',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": id,
                "num": num
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = that.data.list;

                    // console.log(a);
                    a = a.map((item) => {
                        // console.log(item);
                        // var c = item.goods_list;
                        item.goods_list = item.goods_list.map((im) => {
                            // console.log(im);
                            if (im.id == id) {
                                im.num = res.data.data.num;
                                im.total = im.num * im.price;
                            }
                            return im;
                        });
                        // console.log(item);
                        return item;
                    });
                    // console.log(a);
                    var b = that.getTotalPrice(a);
                    // console.log(b);
                    that.setData({
                        list: a,
                        priceAll: Math.formatFloat(b, 2)
                    });

                    that.getCartCount();
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
        */
    },
    modifNumClick(e) {
        // console.log(e)
        var that = this;
        var a = e.currentTarget.dataset;
        // console.log(a);
        if (a.status == 1) {
            if (a.item.num > 1) {
                that.updateNum(a.item.id, --a.item.num);
            }
        }

        if (a.status == 2) {
            that.updateNum(a.item.id, ++a.item.num);
        }
    },
    toComfirmOrder() {
        var that = this;
        var list = that.data.checkedList;
        if (list.length == 0) {
            wx.showToast({
                title: '请选择商品',
                icon: 'none',
            })
        } else {
            var ids = JSON.stringify(network.arrToObj(list));
            // console.log(ids);
            network.POST({
                url: 'v13/shop-order/go-buy',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "ids": ids
                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        wx.setStorageSync("goods", res.data.data[0]);
                        wx.navigateTo({
                            url: '/pages/home/pages/periphery/confirmOrder/confirmOrder?flag=2&ids=' + ids
                        });
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
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
        }
    },
    getCartCount() {
        var that = this;
        network.POST({
            url: 'v13/shop-order/order-num',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        cartCount: res.data.data[0].cartcount
                    });
                    wx.setStorageSync('cartCount', res.data.data[0].cartcount);
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
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
    deleteGoods(e) {
        // console.log(e);
        var that = this;
        var id = {
            "0": e.currentTarget.dataset.id
        };
        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            success: function (res) {
                if (res.confirm) {
                    network.POST({
                        url: 'v13/shop-cart/del',
                        params: {
                            "mobile": app.userInfo.mobile,
                            "token": app.userInfo.token,
                            "ids": JSON.stringify(id)
                        },
                        success: function (res) {
                            // console.log(res);
                            wx.hideLoading();
                            if (res.data.code == 200) {
                                wx.showToast({
                                    title: '删除成功'
                                });
                                that.getList();
                                that.getCartCount();
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
                }
            }
        })
    },
    onUnload: function () {
        this.setData({
            showEmpty: false
        });
    },
    tz_shangjia: function (e) {
        wx.navigateTo({
            url: '/pages/home/pages/ecology/businessDetail/businessDetail?businessid=' + e.currentTarget.dataset.businessid
        })
    },
    //手指刚放到屏幕触发
    touchS: function (e) {
        if (e.touches.length == 1) {
            this.setData({
                startX: e.touches[0].clientX
            });
        }
    },
    //触摸时触发，手指在屏幕上每移动一次，触发一次
    touchM: function (e) {
        var that = this
        if (e.touches.length == 4) {
            var moveX = e.touches[0].clientX;
            var disX = that.data.startX - moveX;
            var delBtnWidth = that.data.delBtnWidth;
            var txtStyle = "";
            if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
                txtStyle = "left:0px";
            } else if (disX > 3) {//移动距离大于0，文本层left值等于手指移动距离
                txtStyle = "left:-" + disX + "px";
                if (disX >= delBtnWidth) {
                    //控制手指移动距离最大值为删除按钮的宽度
                    txtStyle = "left:-" + delBtnWidth + "px";
                }
            }
            var a = e.currentTarget.dataset;
            var list = that.data.list;
            list[a.idx].goods_list[a.index].txtStyle = txtStyle;
            that.setData({
                list: list
            });

        }
    },
    touchE: function (e) {
        var that = this
        if (e.changedTouches.length == 1) {
            //手指移动结束后触摸点位置的X坐标
            var endX = e.changedTouches[0].clientX;
            //触摸开始与结束，手指移动的距离
            var disX = that.data.startX - endX;
            var delBtnWidth = that.data.delBtnWidth;
            //如果距离小于删除按钮的1/2，不显示删除按钮
            var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
            var a = e.currentTarget.dataset;
            var list = that.data.list;
            list[a.idx].goods_list[a.index].txtStyle = txtStyle;
            that.setData({
                list: list
            });
        }
    },
})