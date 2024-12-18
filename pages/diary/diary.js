// pages/diary/diary.js
const WXAPI = require("apifm-wxapi")
WXAPI.init("ottolsq")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayList: [][0],
    diaryList: [],

  },

  // 时间戳转换为日期
  formatTime(timestamp){
    let date = new Date(timestamp);

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = date.getDate();
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    // let seconds = String(date.getSeconds()).padStart(2, '0');

    return [year, month, day, hours, minutes]
  },

  // 是否在一同天
  isOneDay(s1, s2) {
    if(Math.floor(s1 / 86400000) == Math.floor(s2 / 86400000)){return 1}
    else {return 0}
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
        console.log("get diaryList and userDiaryListId success");

        if( res.data[0].tpye == "tip") {
          wx.setStorageSync("tipList", res.data[0].jsonData.msg)
          wx.setStorageSync("diaryList", res.data[1].jsonData.msg)
          wx.setStorageSync("userTipListId", res.data[0].id)
          wx.setStorageSync("userDiaryListId", res.data[1].id)
          this.setData({
            diaryList: res.data[1].jsonData.msg,
          })
        }else{
          wx.setStorageSync("tipList", res.data[1].jsonData.msg)
          wx.setStorageSync("diaryList", res.data[0].jsonData.msg)
          wx.setStorageSync("userTipListId", res.data[1].id)
          wx.setStorageSync("userDiaryListId", res.data[0].id)
          this.setData({
            diaryList: res.data[0].jsonData.msg,
          })
        }
      }

      this.assortDiary()
    })
  },

  // 排序diaryList
  // 一组有序数据
  assortDiary() {
    let list = this.data.diaryList

    // console.log(list);
    if (!list.length) {
      this.setData({
        dayList: []
      })
      return
    }

    let j = 0
    let dayList = []
    let list_ = []  // tempList
    // 第一个
    list[list.length-1].updatetime = this.formatTime(list[list.length-1].updatetime)
    list_.push(list[list.length-1])

    // only one
    if(list.length == 1){dayList.push(list_)}
    
    for (let i = list.length-2 ; i >= 0; i--) {
      list[i].updatetime = this.formatTime(list[i].updatetime)
      if(list[i].updatetime[0] == list[i+1].updatetime[0] && list[i].updatetime[1] == list[i+1].updatetime[1] && list[i].updatetime[2] == list[i+1].updatetime[2]){
        // 与上一个同天
        list_.push(list[i])
        dayList[j] = list_
      }else{
        // 与上一个不同天
        // frist
        if(i == list.length-2){
          dayList.push(list_)
        }
        j++
        list_ = []
        list_.push(list[i])
        dayList.push(list_)        
      }
    }

    // console.log(dayList);
    this.setData({
      dayList: dayList
    })

  },

  edit(e) {
    // console.log(e.currentTarget.dataset.id);
    console.log("to diaryView");
    wx.navigateTo({
      url:  `/pages/diaryView/diaryView?diaryId=${e.currentTarget.dataset.id}`
    })

  },

  plus() {
    console.log("plus to diaryView");
    wx.navigateTo({
      url:  `/pages/diaryView/diaryView?diaryId=-1`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(wx.getStorageSync("userDiaryListId"));
    if(wx.getStorageSync("userToken")){
      // console.log(wx.getStorageSync("userToken"));
      console.log("logined")

    } else {
      console.log("not login")
      this.setData({
        diaryList: [
          {
            "id": 0,
            "title": "快写下第一个随记吧",
            "data": "",
            "updatetime": Date.now()
          }
        ]
      })

      wx.setStorageSync("diaryList", this.data.diaryList)
      // console.log(wx.getStorageSync("diaryList"));

      this.assortDiary()
    }
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
    console.log("review");
    
    // this.getJson()
    if(wx.getStorageSync("userToken")){
      this.getJson()
      // wx.setStorageSync("diaryList", this.data.diaryList)
      // console.log(this.data.diaryList);
    } else {
      this.setData({
        diaryList: wx.getStorageSync("diaryList")
      })
      this.assortDiary()
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
        diaryList: wx.getStorageSync("diaryList"),
      })
      this.assortDiary()
      wx.stopPullDownRefresh()
      return
    }

    // // 只获取 refId 的数据
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
            diaryList: res.data[1].jsonData.msg,
          })
        }else{
          wx.setStorageSync("tipList", res.data[1].jsonData.msg)
          wx.setStorageSync("diaryList", res.data[0].jsonData.msg)
          wx.setStorageSync("userTipListId", res.data[1].id)
          wx.setStorageSync("userDiaryListId", res.data[0].id)
          this.setData({
            diaryList: res.data[0].jsonData.msg,
          })
        }
      }

      this.assortDiary()
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