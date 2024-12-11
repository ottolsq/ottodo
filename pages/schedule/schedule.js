// pages/schedule/schedule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 初始
    color_type: "",

    years: [],
    months:[1,2,3,4,5,6,7,8,9,10,11,12],
    isChangeMonth: 0,

    // 日历
    month: "",
    date_num: "",
    week: "",

    empty_list_0: [],
    date_list: [],
    empty_list_1: [],

    // tips
    date_ed: "", // 当前选中的日期
    tipList_new: [], // 当前选中的日期的tips
    
    // test 数据
    tipList: [
      {
        "id": 0,
        "type": "type_0",
        "data": "this first tip",
        "updatetime": 1733898553030
      },
      {
        "id": 1,
        "type": "type_1",
        "data": "sssss",
        "updatetime": 1733898553030
      },
      {
        "id": 2,
        "type": "type_2",
        "data": "aaaa",
        "updatetime": 1733898553030
      },
      {
        "id": 3,
        "type": "type_2",
        "data": "aaaa",
        "updatetime": 1733898553030
      },
      {
        "id": 4,
        "type": "type_2",
        "data": "aaaa",
        "updatetime": 1733898553030
      },
      {
        "id": 5,
        "type": "type_2",
        "data": "aaaa",
        "updatetime": 1733898553030
      },
      {
        "id": 6,
        "type": "type_2",
        "data": "aaaa",
        "updatetime": 1733898553030
      },
      {
        "id": 99,
        "type": "type_3",
        "data": "ccaads",
        "updatetime": 1733898553030
      },
    ],
  },

  getDate(){
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const formattedTime = year + "/" + month

    let years = []
    for (let i = year; i >= 1990; i--) {
      years.push(i)
    }

    this.setData({
      years: years,
      month: formattedTime
    })

    console.log(this.data.month);
  },

  changeMonth() {
    console.log(this.data.month);
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

  bindChange(e){
    const val = e.detail.value
    let month = this.data.years[val[0]] +"/"+this.data.months[val[1]]
    this.setData({
      month: month
    })

    this.getScheduleDate()
  },

  // 获取某年某月的天数
  getDateNum(year, month) { // month 从1开始
    const date = new Date(year, month, 0);

    // 获取日期的部分，即该月的天数
    return date.getDate();
  },

  getScheduleDate() {
    let year = this.data.month.split('/')[0]
    let month = this.data.month.split('/')[1]
    let date = this.getDateNum(year, month)
    let dayOfWeek = new Date(year, month-1, 1).getDay();
    
    let arr0 = new Array(dayOfWeek)
    let arr1 = new Array(date)
    let arr2 = new Array(7*5 - date - dayOfWeek)

    this.setData({
      date_num: date,
      week: dayOfWeek,
      empty_list_0: arr0,
      date_list: arr1,
      empty_list_1: arr2,
    })

    console.log(this.data.date_num);
    console.log(this.data.week);
  },

  // todo: 时间戳转换为日期，只要天数

  // todo: 按时间分类tips
  assortTips() {
    // this.data.tipList
    // 年月日一致则展示
    // this.data.tipList_new

  },

  // todo: 根据tip数量改变date_son




  getTipIndex(id) {
    for (let i = 0; i < this.data.tipList.length; i++) {
      if (this.data.tipList[i].id == id) {
        return i
      } 
    }
  },

  finished(e) {
    console.log(e.currentTarget.dataset.id)
    let index = this.getTipIndex(e.currentTarget.dataset.id)
    let list = this.data.tipList

    list.splice(index, 1);
    this.setData({
      tipList: list
    })    
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      color_type: wx.getStorageSync("colorType")
    })

    this.getDate()

    this.getScheduleDate()

    
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