// pages/index/index.js
const WXAPI = require("apifm-wxapi")
WXAPI.init("ottolsq")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // userInfo
    avatarUrl: "",

    // setting
    colorType: "default",

    // logging
    ing: '',
    date: '',
    i: 0,

    // view
    isLogoutView: 0,
    isOthersView: 0,
    isAddTip: 0,
    isModTip: 0,

    // view others
    isSettingView: 0,
    isStatisticsView: 0,
    isReportView: 0,

    // newTip
    type: 0,
    data: "",

    // modTip
    index: "",
    updatetime: "",

    type_styles: ["type_son_ed", "type_son", "type_son"],
    tipList: [],
  },

  login() {
    wx.login({
      success: function (res) {
        const code = res.code; // 微信登录接口返回的 code 参数，下面登录接口需要用到
        WXAPI.login_wx(code).then(function (res) {
          // 登录接口返回结果
          console.log(res);
          if(res.code == 0) {
            // 缓存用户token
            wx.setStorageSync("userToken", res.data)
            // console.log(wx.getStorageSync("userToken"));
            // console.log(res.data);

            console.log("login success");
          }else{console.log("login fail");}
        })
      }
    })
  },

  logoutView() {
    this.setData({
    isLogoutView: 1,
    })

    setTimeout(()=>{
      this.setData({
        isLogoutView: 0,
        })

    }, 1500)
  },

  // register and login
  register(e) {
    if (!e.detail) {
      // 你点了取消授权
      console.log("out");
      return;
    }

    // console.log(e);
    this.setData({
      avatarUrl: e.detail.avatarUrl
    })

    let register_code = ""
    wx.login({
      success: function (res) {
        //只能用一次
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
              console.log("register:", res)
               register_code = res.code
              // console.log(register_code);

              if (register_code == 10000 || register_code == 0) {

                // console.log("register success");
                if(register_code == 10000){console.log("registered code: 10000");}
                if(register_code == 0){console.log("register success code 0");}

                wx.login({
                  success: function (res) {
                    const code = res.code; // 微信登录接口返回的 code 参数，下面登录接口需要用到
                    WXAPI.login_wx(code).then(function (res) {
                      // 登录接口返回结果
                      console.log("login:", res);
                      if(res.code == 0) {
                        // 缓存用户token
                        wx.setStorageSync("userToken", res.data)
                        // console.log(wx.getStorageSync("userToken"));
                        // console.log(res.data);
            
                        console.log("login success");
                        // 缓存头像
                        wx.setStorageSync("avatarUrl", e.detail.avatarUrl)        
                        // console.log(wx.getStorageSync("avatarUrl"));
                        console.log("userToken:", wx.getStorageSync("userToken"));
                        if(register_code == 0){

                          // 参数中没有id就是新增，反之为修改
                          WXAPI.jsonSet({
                            type: "代办",
                            token: wx.getStorageSync("userToken").token,
                            refId: wx.getStorageSync("userToken").uid,
                            content: '{"msg": [{"data": "快来写下第一个代办吧", "id": 0, type: "0", "updatetime": ' + Date.now() +'}]}'
                          }).then(res => {
                            this.getJson()
                            // console.log(res);
                            // console.log("error");
                          })
                        }
                        
                        WXAPI.jsonList({
                          refId: wx.getStorageSync("userToken").uid,
                          token: wx.getStorageSync("userToken").token,
                        }).then(res => {
                          if (res.code == 0) {
                            // todo: 登录无法即时获取到代办数据，可能是js异步问题
                            console.log("获取成功");
                            wx.setStorageSync("tipList", res.data[0].jsonData.msg)
                            // this.setData({
                            //   tipList: res.data[0].jsonData.msg
                            // })
                          }
                        })
                      }else{console.log("login fail");}
                    })
                  }
                })                
              } else {
                console.log("register fail");
                return
              }
            })
          }
        })
      }
    })
    // this.setData({tipList: wx.getStorageSync("tipList")})
    // console.log(wx.getStorageSync("tipList"));
  },

  async r_l(e) {
    try {
      await this.register(e)
      // 无法执行 下面的代码
      // 1.
      // await this.getJson()
      // 2.
      // await wx.redirectTo({
      //   url:  "/pages/index/index"
      // });
      // 2.
      // await function() {
      //   setTimeout(()=>{
      //     console.log("done");
      //     // todo: 放不进去
      //     this.setData({tipList: wx.getStorageSync("tipList")})
      //   }, 1000) 
      // }
    } catch (err) {
      console.log(err);
      console.log("login fail");
    }
  },

  logout(e) {
    console.log("logout");
    this.initData()
    this.setData({
      avatarUrl: "",
      tipList: []
    })
  },

  // 初始化
  addJson() {
    const userToken = wx.getStorageSync("userToken")
    if(!userToken){
      console.log("未登录");
      return
    }

    WXAPI.jsonSet({
      type: "代办",
      token: userToken.token,
      refId: wx.getStorageSync("userToken").uid,
      // id: wx.getStorageSync("userTipListId"),
      content: '{"msg": [{"data": "快来写下第一个代办吧", "id": 1, type: "0", "updatetime": ' + Date.now() +'}]}'
    }).then(res => {
      console.log(res);
      // console.log("error");
    })

    // to set userTipListId
    this.getJson()
  },


  modJson() {
    const userToken = wx.getStorageSync("userToken")
    if(!userToken){
      console.log("未登录");
      return
    }

    // 参数中没有id就是新增，反之为修改
    WXAPI.jsonSet({
      type: "代办",
      token: userToken.token,
      refId: wx.getStorageSync("userToken").uid,
      // [{"data": "登录、设置", "id": 0, type: "0", "updatetime": 1733898553030}]
      id: wx.getStorageSync("userTipListId"),
      content: '{"msg": '+ JSON.stringify(this.data.tipList)+ '}'
    }).then(res => {
      // console.log(res);
      // console.log("error");
    })
  },

  getJson() {
    const userToken = wx.getStorageSync("userToken")
    if(!userToken){
      console.log("未登录");
      return
    }

    console.log("getJson");

    // 只获取 refId 的数据
    WXAPI.jsonList({
      refId: wx.getStorageSync("userToken").uid,
      token: userToken.token,
    }).then(res => {
      if (res.code == 0) {
        console.log("get tipList and userTipListId success");
        wx.setStorageSync("tipList", res.data[0].jsonData.msg)
        wx.setStorageSync("userTipListId", res.data[0].id)
        console.log("cache:", wx.getStorageSync("userTipListId"));
        this.setData({
          tipList: res.data[0].jsonData.msg,
        })
      }
    })
  },

  // time
  logging(){
    setInterval(() => {
      let arr = ['-' ,'\\' ,'|', '/']
      this.setData({
        ing: arr[this.data.i%arr.length]
      })
      // console.log(this.data.i);
      this.data.i++;
      if (this.data.i == 4) {
        this.setData({
          i: 0
        })
      }
    }, 250)
  },
  
  // set date
  getDate(){
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const formattedTime = year%100 + "-" + month + "-" + day;
    console.log("time:", formattedTime);
    this.setData({
      date: formattedTime
    })
  },

  // OtherView
  others(){
    // console.log("other");
    if(!this.data.isOthersView){
      this.setData({
        isOthersView: 1
      })
    }else {
      this.setData({
        isOthersView: 0
      })
    }
    // console.log(this.data.isOthersView);
  },

  // OtherSonView
  other_son_View(e) {
    if (e.currentTarget.dataset.id == 0) {
      if(!this.data.isSettingView){
        this.setData({
          isSettingView: 1,
          isOthersView: 0
        })
      }else {
        this.setData({
          isSettingView: 0
        })
      }
    }else if(e.currentTarget.dataset.id == 1) {
      if(!this.data.isStatisticsView){
        this.setData({
          isStatisticsView: 1,
          isOthersView: 0
        })
      }else {
        this.setData({
          isStatisticsView: 0
        })
      }
    }else {
      if(!this.data.isReportView){
        this.setData({
          isReportView: 1,
          isOthersView: 0
        })
      }else {
        this.setData({
          isReportView: 0
        })
      }
    }    
  },

  // changeColor
  changeColor(e) {
    if(e.currentTarget.dataset.id == 0) {
      wx.setStorageSync("colorType", "default")
    }else if(e.currentTarget.dataset.id == 1) {
      wx.setStorageSync("colorType", "cold")
    }else {
      wx.setStorageSync("colorType", "warm")
    }
    console.log(wx.getStorageSync("colorType"))
  },

  // addTipView
  addTip(){
    // console.log("add Tip");
    if(!this.data.isAddTip){
      this.setData({
        isAddTip: 1,
        type: "0",
        data: ""
      })
    }else {
      let s = this.changeTypeStyle(0)
      this.setData({
        isAddTip: 0,
        type: "0",
        type_styles: s,
        data: ""
      })
    }
    // console.log(this.data.isAddTip);
  },
  
  // 生成id
  generateId() {
    return Date.now() % 1000000000 + Math.floor(Math.random()*10);
  },

  // handleAdd
  handleAdd() {
    let list = this.data.tipList
    let newTip = {
      "id": this.generateId(),
      "type": this.data.type,
      "data": this.data.data,
      "updatetime": Date.now()
    }
    list.push(newTip)
    this.setData({
      tipList: list
    })
    this.addTip()
    // console.log(this.data.tipList);

    wx.setStorageSync("tipList", list)
    console.log(list);
    this.modJson()
  },

  // 取消添加
  // cancleAdd() {
  //   this.addTip()
  // },

  // 修改选中的元素的样式
  changeTypeStyle(type_id) {
    let styles = this.data.type_styles
    for (let i = 0; i < styles.length; i++) {
      if(i == type_id) styles[i] = "type_son_ed"
      else styles[i] = "type_son"
    }
    return styles
  },

  // 选中type
  checkedType(e) {
    // console.log(e.currentTarget.id);
    let type_id = e.currentTarget.dataset.id
    console.log(type_id);

    // 修改选中的元素的样式
    let styles =  this.changeTypeStyle(type_id)

    this.setData({
      type_styles: styles,
      type: type_id
    })
    // console.log(this.data.type);
  },

  // 得到输入的数据
  getData(e) {
    this.setData({
      data: e.detail.value
    })
    // console.log(this.data.data);
  },

  // 获取指定id的tip在tipList中的索引位置
  getTipIndex(id) {
    for (let i = 0; i < this.data.tipList.length; i++) {
      if (this.data.tipList[i].id == id) {
        return i
      } 
    }
  },

  // modTipView
  modTip(e){
    // console.log("mod Tip");
    if(!this.data.isModTip){

      let id = e.currentTarget.dataset.id
      // console.log(id);
      let index = this.getTipIndex(id)
      this.setData({
        index: index,
        data: this.data.tipList[index].data,
        updatetime: this.formatTime(this.data.tipList[index].updatetime),
        isModTip: 1,
      })
    }else {
      this.setData({
        index: 0,
        data: "",
        updatetime: 0,
        isModTip: 0
      })
    }    
    // console.log(this.data.isModTip);
  },

  // 格式化时间戳为本地时间
  formatTime(timestamp){
    const date = new Date(timestamp);

    let options = {
      dateStyle: 'short', // 'full', 'long', 'medium', 'short'
      timeStyle: 'short', // 'full', 'long', 'medium', 'short'
    };
    let formattedDate = date.toLocaleString('zh-CN', options)
    // console.log(formattedDate);
    return formattedDate
  },

  // handleMod
  handleMod() {
    // 如果没改
    if (this.data.tipList[this.data.index].data == this.data.data) {
      this.modTip()
      return
    }

    let list = this.data.tipList
    list[this.data.index].data = this.data.data
    list[this.data.index].updatetime = Date.now()
    this.setData({
      tipList: list,
    })
    wx.setStorageSync("tipList", list)
    this.modTip()
    // console.log(this.data.tipList);

    this.modJson()
  },

  // delete Tip
  deleteTip() {
    let list = this.data.tipList
    list.splice(this.data.index, 1);
    this.setData({
      tipList: list
    })

    wx.setStorageSync("tipList", list)
    this.modTip()
    // console.log(this.data.tipList);

    this.modJson()
  },

  // finished Tip
  finished(e) {
    // console.log(e.currentTarget.dataset.id)
    let index = this.getTipIndex(e.currentTarget.dataset.id)
    let list = this.data.tipList

    list.splice(index, 1);
    this.setData({
      tipList: list
    })
    // console.log(this.data.tipList);

    wx.setStorageSync("tipList", list)
    this.modJson()
  },

  // toSchedule
  toSchedule(){
    console.log("to Schedule");
    wx.navigateTo({
      url:  "/pages/schedule/schedule"
    })
  },
  
  // toDiary
  toDiary(){
    console.log("to Diary");
    wx.redirectTo({
      url:  "/pages/diary/diary"
    })
  },

  // 清空缓存
  initData(){
    wx.setStorageSync("avatarUrl", "")
    wx.setStorageSync("userToken", "")
    wx.setStorageSync("colorType", "")
    wx.setStorageSync("tipList", "")
    wx.setStorageSync("userTipListId", "")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.logging()
    this.getDate()
    
    if(wx.getStorageSync("userToken")){
      // console.log(wx.getStorageSync("userToken"));
      console.log("logined");
      // this.getJson()
      this.setData({
        avatarUrl: wx.getStorageSync('avatarUrl')
      })

    }else {
      // test
      console.log("not login");
      this.initData()
      this.setData({
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
            "data": "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊",
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
            "data": "json设置的为新增，无法获取，且为通用属性",
            "updatetime": 1733898553030
          },
          {
            "id": 6,
            "type": "1",
            "data": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
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
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示 只要显示就触发
   */
  onShow() {
    // 在schedule页面修改（点击了完成）tipList需要用到
    console.log("review index");
    this.getJson()
    // if(wx.getStorageSync("tipList") != "") {
    //   console.log("review");
    //   this.setData({
    //     tipList: wx.getStorageSync("tipList"),
    //   })
    // }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // 在schedule页面修改（点击了完成）tipList需要用到
    // console.log("index hide");
    // wx.setStorageSync("tipList", this.data.tipList)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // wx.setStorageSync("tipList", this.data.tipList)
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