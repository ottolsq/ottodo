// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // colorType: "default",

    ing: '',
    date: '',
    i: 0,

    // view
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
        "id": 99,
        "type": "type_3",
        "data": "ccaads",
        "updatetime": 1733898553030
      },
    ],
  },

  // date and time
  logging(){
    let i = 0
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
  
  getDate(){
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const formattedTime = year%100 + "." + month + "." + day;
    console.log(formattedTime);
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
        type: "type_0",
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

  // handleAdd ***
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
    console.log(this.data.tipList);

    // todo: send add request ******
    // data: type, data, updatetime
  },

  cancleAdd() {
    this.addTip()
  },

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
    let type_id = e.currentTarget.id.split('_')[1]
    // console.log(type_id);

    // 修改选中的元素的样式
    let styles =  this.changeTypeStyle(type_id)

    this.setData({
      type_styles: styles,
      type: e.currentTarget.id
    })
    // console.log(this.data.type);
  },

  getData(e) {
    // console.log(e.detail.value);
    this.setData({
      data: e.detail.value
    })
    // console.log(this.data.data);
  },

  getTipIndex(id) {
    for (let i = 0; i < this.data.tipList.length; i++) {
      if (this.data.tipList[i].id == id) {
        return i
      } 
    }
  },

  // modTipView ***
  modTip(e){
    // console.log("mod Tip");
    if(!this.data.isModTip){
      let id = e.currentTarget.dataset.id
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
        isModTip: 0
      })
    }    
    // console.log(this.data.isModTip);
  },

  // 格式时间戳为本地时间
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

  handleMod() {
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
    this.modTip()
    console.log(this.data.tipList);

    // todo: send mod request ******
    // data: id, data, updatetime
  },
  
  deleteTip() {
    let list = this.data.tipList
    list.splice(this.data.index, 1);
    this.setData({
      tipList: list
    })
    this.modTip()
    console.log(this.data.tipList);

    // todo: send delete request ******
    // data: id
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.logging()
    this.getDate()

    // console.log(this.formatTime(1733898553030));
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