// pages/schedule/schedule.js
const WXAPI = require("apifm-wxapi")
WXAPI.init("ottolsq")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 初始
    colorType: "",

    // 选定指定年月
    years: [],
    months:[1,2,3,4,5,6,7,8,9,10,11,12],
    isChangeMonth: 0,

    // 日历
    year: "",     // 当前年    
    month: "",    // 当前年月，从零开始

    date_num: "", // 当前月的天数
    // week: "",     // 第一天的星期数

    // 渲染Schedule
    empty_list_0: [],
    empty_list_1: [],
    // tips
    month_tips: [],  // 当前月的tips分布情况
    date_ed: "",     // 当前选中的日期，从零开始
    tipList_new: [], // 当前选中的日期的tips
    
    // 数据
    tipList: [],
  },

  // 获取当前的时间，并赋值picker元素
  // 当前选中的日期，默认为当日
  getDate(){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    let years = []
    for (let i = year; i >= 1990; i--) {
      years.push(i)
    }

    this.setData({
      years: years,
      year: year,
      month: month,
      date_ed: day-1,
    })
    // console.log(this.data.year);
    // console.log(this.data.month);
    // console.log(this.data.date_ed);
  },

  // changeMonthView
  changeMonth() {
    console.log(this.data.month, this.data.year);
    if (!this.data.isChangeMonth) {
      this.setData({
        isChangeMonth: 1
      })  
    }else{
      this.setData({
        isChangeMonth: 0
      })  
    }
  },

  // changeMonth
  bindChange(e){
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]]-1,
      date_ed: 0,
    })

    // console.log(this.data.year);
    // console.log(this.data.month);

    this.getScheduleDate()
    this.assortTips()
    this.getMonthTipsStatus(this.data.year, this.data.month)
  },

  // 获取某年某月的天数
  getDateNum(year, month) { // month 从1开始
    const date = new Date(year, month+1, 0);

    // 获取日期的部分，即该月的天数
    return date.getDate();
  },

  // 渲染Schedule表
  getScheduleDate() {
    let year = this.data.year
    let month = this.data.month
    let date = this.getDateNum(year, month)
    // 星期，星期日为0
    let dayOfWeek = new Date(year, month, 1).getDay();
    
    let arr0 = new Array(dayOfWeek)
    let arr1 = new Array(date)
    let arr2 = new Array(7*5 - date - dayOfWeek)

    this.setData({
      date_num: date,
      empty_list_0: arr0,
      month_tips: arr1,
      empty_list_1: arr2,
    })
    // console.log(this.data.date_num);
    // console.log(this.data.week);
  },

  // 时间戳转换为日期，0为天数，1为月数，2为年数
  formatTime(timestamp, t){
    if(t == 0) return new Date(timestamp).getDate()
    else if(t==1)return new Date(timestamp).getMonth()
    else return new Date(timestamp).getFullYear();
  },

  // 按时间分类tips
  assortTips() {
    // console.log(this.data.tipList);
    let tipList_new = this.data.tipList.filter((item) => {
      if (this.formatTime(item.updatetime, 0) == this.data.date_ed + 1) return item
    })

    this.setData({
      tipList_new: tipList_new,
    })
    // console.log(this.data.tipList_new);
  },

  // 获取指定月的tips分布情况
  getMonthTipsStatus(year, mount) {
    let datas =  this.data.tipList
    let month_tips = new Array(this.data.date_num).fill(0)
    
    for (let i = 0; i < datas.length; i++) {
      if(this.formatTime(datas[i].updatetime, 1) == mount && this.formatTime(datas[i].updatetime, 2) == year) {
        // 有tip就+1 // 0~30，以零开头
        month_tips[this.formatTime(datas[i].updatetime, 0)-1]++
      }
    }

    this.setData({
      month_tips: month_tips
    })
    // console.log(this.data.month_tips);
  },

  // change date_ed
  chooseDay(e) {
    this.setData({
      date_ed: e.currentTarget.dataset.id
    })
    this.assortTips()
  },

 // 获取指定id的tip在tipList中的索引位置
  getTipIndex(id) {
    for (let i = 0; i < this.data.tipList.length; i++) {
      if (this.data.tipList[i].id == id) {
        return i
      } 
    }
  },

  // 删除逻辑
  finished(e) {
    // console.log(e.currentTarget.dataset.id)
    let index = this.getTipIndex(e.currentTarget.dataset.id)

    // 在总表中删除
    let list = this.data.tipList
    list.splice(index, 1);
    this.setData({
      tipList: list
    })

    wx.setStorageSync("tipList", list)
    // console.log(wx.getStorageSync("tipList"));

    this.assortTips()
    this.getMonthTipsStatus(this.data.year, this.data.month)

    // 提交
    const userToken = wx.getStorageSync("userToken")
    if(!userToken){
      console.log("not login");
      return
    }
    // 参数中没有id就是新增，反之为修改
    WXAPI.jsonSet({
      type: "代办",
      token: userToken.token,
      refId: wx.getStorageSync("userToken").uid,
      id: wx.getStorageSync("userTipListId"),
      content: '{"msg": '+ JSON.stringify(this.data.tipList)+ '}'
    }).then(res => {
      // console.log(res);
      // console.log("error");
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(wx.getStorageSync("tipList"));

      this.setData({
        colorType: wx.getStorageSync("colorType"),
        tipList: wx.getStorageSync("tipList")
      })

      // 获取当前的时间
      this.getDate()
      this.getScheduleDate()
      this.assortTips()
      this.getMonthTipsStatus(this.data.year, this.data.month)
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
    // 在schedule页面修改（点击了完成）tipList需要用到
    // console.log("schedule hide");
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
    console.log("refresh getJson");
    const userToken = wx.getStorageSync("userToken")
    if(!userToken){
      console.log("not login");
      wx.stopPullDownRefresh()
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

        if( res.data[0].tpye == "tip") {
          wx.setStorageSync("tipList", res.data[0].jsonData.msg)
          wx.setStorageSync("userTipListId", res.data[0].id)
          this.setData({
            tipList: res.data[0].jsonData.msg,
          })
        }else{
          wx.setStorageSync("tipList", res.data[1].jsonData.msg)
          wx.setStorageSync("userTipListId", res.data[1].id)
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