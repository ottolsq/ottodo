// pages/diary/diary.js
const WXAPI = require("apifm-wxapi")
WXAPI.init("ottolsq")


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipList: [
      {
        "id": 0,
        "type": "0",
        "data": "登录、设置",
        "updatetime": 1733898553030
      },
      {
        "id": 1,
        "type": "0",
        "data": "相关request",
        "updatetime": 1733898553030
      },
      {
        "id": 2,
        "type": "1",
        "data": "tipView: 行距问题、大小问题、文字自动换行问题",
        "updatetime": 1733898553030
      },
      {
        "id": 3,
        "type": "1",
        "data": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "updatetime": 1733898553030
      },
      {
        "id": 4,
        "type": "2",
        "data": "picker元素的bug：2024.3/6月",
        "updatetime": 1733898553030
      },
      {
        "id": 5,
        "type": "0",
        "data": "关闭按钮接触面积需要扩大",
        "updatetime": 1733898553030
      },
      {
        "id": 6,
        "type": "1",
        "data": "aaaa",
        "updatetime": 1733898553030
      },
      {
        "id": 99,
        "type": "0",
        "data": "ccaads",
        "updatetime": 1733898553030
      },
      {
        "id": 100,
        "type": "0",
        "data": "121212",
        "updatetime": 1733981486746
      },
      {
        "id": 101,
        "type": "1",
        "data": "12222222",
        "updatetime": 1733981486746
      },
      {
        "id": 102,
        "type": "2",
        "data": "1222222111",
        "updatetime": 1733981486746
      },
      {
        "id": 103,
        "type": "0",
        "data": "1222222122",
        "updatetime": 1733981486746
      },
      {
        "id": 110,
        "type": "0",
        "data": "1313131313",
        "updatetime": 1734067989000
      },
      {
        "id": 111,
        "type": "1",
        "data": "133333333",
        "updatetime": 1734067989000
      },
    ],

    avatarUrl:""
  },

  login_(e) {
    console.log("test");
    console.log(e.detail);
    console.log(e.detail.avatarUrl);
    this.setData({
      avatarUrl:e.detail.avatarUrl
    })
  },

  login(e) {

    // if (!e.detail.userInfo) {
    //   // 你点了取消授权
    //   return;
    // }
    
    wx.login({
      success: function (res) {
        const code = res.code; // 微信登录接口返回的 code 参数，下面登录接口需要用到
        WXAPI.login_wx(code).then(function (res) {
          // 登录接口返回结果
          // console.log(WXAPI);
          console.log(res.code)
          if(res.code == 0) {
            wx.setStorageSync("userToken", res.data)  
            console.log(res.data);
          }
          console.log(wx.getStorageSync('userToken'));
        })
      }
    })
  },

  jsonSet() {
    const  userToken = wx.getStorageSync("userToken")

    if(!userToken){
      console.log("未登录");
      return
    }

    // 参数中没有id就是新增，反之为修改
    WXAPI.jsonSet({
      type: "代办",
      token: userToken.token,
      refId: wx.getStorageSync("userToken").uid,

      // id: 231637605,
      content: '{"msg": '+ JSON.stringify(this.data.tipList)+ '}'
    }).then(res => {
      console.log(res);
      // console.log("error");
    })


    // 只获取 refId 的数据
    WXAPI.jsonList({
      refId: wx.getStorageSync("userToken").uid,
      token: userToken.token,
    }).then(res => {
      // 直接获得全部的json
      console.log(res);
      console.log(res.data);

    })

  },

  register(e) {
    console.log("register");

    // if (!e.detail.userInfo) {
    //   // 你点了取消授权
    //   return;
    // }

    wx.login({
      success: function (res) {
        const code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            const iv = res.iv;
            const encryptedData = res.encryptedData;

            // 微信授权注册 给WXAPI openid

            // 下面开始调用注册接口
            WXAPI.register_complex({
              code: code,
              encryptedData: encryptedData,
              iv: iv
            }).then(function (res) {
              // 注册接口返回结果
              console.log(res)
            })
          }
        })
      }
    })
    
  },

  changeTextarea(e) {
    console.log(e);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // WXAPI.province().then(res => {
    //   console.log('请在控制台看打印出来的数据：', res)
    // })

    // this.login()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})