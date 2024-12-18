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

  login(register_code) {
    let that = this
    wx.login({
      success: function (res) {
        const code = res.code; // 微信登录接口返回的 code 参数，下面登录接口需要用到
        WXAPI.login_wx(code).then(function (res) {
          // 登录接口返回结果
          // console.log("login:", res);
          if(res.code == 0) {
            // 缓存用户token
            wx.setStorageSync("userToken", res.data)
            // console.log(wx.getStorageSync("userToken"));
            // console.log(res.data);

            console.log("login success");
            // 缓存头像
            wx.setStorageSync("avatarUrl", that.data.avatarUrl)        
            if(register_code == 0){
              that.addJson()
            }else {
              that.getJson()
            }
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

    let that = this
    if (!e.detail) {
      // 你点了取消授权
      console.log("out");
      return;
    }

    // console.log(e);
    this.setData({
      avatarUrl: e.detail.avatarUrl
    })

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
              // console.log("register:", res)
              // console.log(register_code);
              if (res.code == 10000 || res.code == 0) {
                if(res.cod == 10000){console.log("registered code: 10000");}
                if(res.cod == 0){console.log("register success code 0");}
                that.login(res.code)
              }else {
                console.log("register fail");
                return
              }
            })
          }
        })
      }
    })
  },

  logout(e) {
    console.log("logout");
    this.initData()

    let list = [
      {
        "id": 0,
        "type": "2",
        "data": "登录才能保存您的数据哦",
        "updatetime": Date.now()
      }
    ]

    this.setData({
      avatarUrl: "",
      tipList: list
    })

    wx.setStorageSync("tipList", list)
  },

  // 初始化
  async addJson() {
      await WXAPI.jsonSet({
        type: "tip",
        token:  wx.getStorageSync("userToken").token,
        refId: wx.getStorageSync("userToken").uid,
        // id: wx.getStorageSync("userTipListId"),
        content: '{"msg": [{"data": "快来写下第一个代办吧", "id": 0, type: "0", "updatetime": ' + Date.now() +'}]}'
      }).then(res => {
        // console.log(res);
        if (res.code == 0) {
          console.log("init tip json success");
        }
        // console.log("error");
      })
      await WXAPI.jsonSet({
        type: "diary",
        token:  wx.getStorageSync("userToken").token,
        refId: wx.getStorageSync("userToken").uid,
        // id: wx.getStorageSync("userTipListId"),
        content: '{"msg": [{"data": "", "id": 0, title: "快写下第一个随记吧", "updatetime": ' + Date.now() +'}]}'
      }).then(res => {
        // console.log(res);
        if (res.code == 0) {
          console.log("init diary json success");
        }
        // console.log("error");
      })
    await this.getJson()
  },

  modJson() {
    const userToken = wx.getStorageSync("userToken")
    if(!userToken){
      console.log("not login");
      return
    }

    // 参数中没有id就是新增，反之为修改
    WXAPI.jsonSet({
      type: "tip",
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
      console.log("not login");
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
        console.log("get diaryList and userDiaryListId success");

        if( res.data[0].tpye == "tip") {
          wx.setStorageSync("tipList", res.data[0].jsonData.msg)
          wx.setStorageSync("diaryList", res.data[1].jsonData.msg)
          wx.setStorageSync("userTipListId", res.data[0].id)
          wx.setStorageSync("userDiaryListId", res.data[1].id)
          this.setData({
            tipList: res.data[0].jsonData.msg,
          })
        }else{
          wx.setStorageSync("tipList", res.data[1].jsonData.msg)
          wx.setStorageSync("diaryList", res.data[0].jsonData.msg)
          wx.setStorageSync("userTipListId", res.data[1].id)
          wx.setStorageSync("userDiaryListId", res.data[0].id)
          this.setData({
            tipList: res.data[1].jsonData.msg,
          })
        }
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
    wx.setStorageSync("tipList", list)
    
    // 提交
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
    } else {
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

    // 提交
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

    // 提交
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

    wx.setStorageSync("tipList", list)

    // 提交
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
    wx.setStorageSync("diaryList", "")
    wx.setStorageSync("userTipListId", "")
    wx.setStorageSync("userDiaryListId", "")
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
        avatarUrl: wx.getStorageSync("avatarUrl")
      })

    }else {
      // test
      console.log("not login");
      this.initData()
      let list = [
        {
          "id": 0,
          "type": "2",
          "data": "登录才能保存您的数据哦",
          "updatetime": Date.now()
        }
      ]

      wx.setStorageSync("tipList", list)
      // console.log(wx.getStorageSync("tipList"));
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
  
    if(!wx.getStorageSync("userToken")){
      console.log("not login");
      this.setData({
        tipList: wx.getStorageSync("tipList"),
      })
      return
    } else {
      this.getJson()
    }
    
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
    console.log("refresh getJson");
    const userToken = wx.getStorageSync("userToken")
    if(!userToken){
      console.log("not login");
      // console.log(wx.getStorageSync("tipList"));
      this.setData({
        tipList: wx.getStorageSync("tipList"),
      })
      wx.stopPullDownRefresh()
      return
    }

    // 只获取 refId 的数据
    WXAPI.jsonList({
      refId: wx.getStorageSync("userToken").uid,
      token: userToken.token,
    }).then(res => {
      if (res.code == 0) {
        if( res.data[0].tpye == "tip") {
          wx.setStorageSync("tipList", res.data[0].jsonData.msg)
          wx.setStorageSync("diaryList", res.data[1].jsonData.msg)
          wx.setStorageSync("userTipListId", res.data[0].id)
          wx.setStorageSync("userDiaryListId", res.data[1].id)
          this.setData({
            tipList: res.data[0].jsonData.msg,
          })
        }else{
          wx.setStorageSync("tipList", res.data[1].jsonData.msg)
          wx.setStorageSync("diaryList", res.data[0].jsonData.msg)
          wx.setStorageSync("userTipListId", res.data[1].id)
          wx.setStorageSync("userDiaryListId", res.data[0].id)
          this.setData({
            tipList: res.data[1].jsonData.msg,
          })
        }
      }
      wx.stopPullDownRefresh()
    })
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