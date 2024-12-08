// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ing: '',
    date: '',
    i: 0,

    isOthersView: 0,
    isAddTip: 0,
    isModTip: 0,

    data: "",
  },

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

  others(){
    console.log("other");
    if(!this.data.isOthersView){
      this.setData({
        isOthersView: 1
      })
    }else {
      this.setData({
        isOthersView: 0
      })
    }
    console.log(this.data.isOthersView);
  },

  addTip(){
    console.log("add Tip");
    if(!this.data.isAddTip){
      this.setData({
        isAddTip: 1
      })
    }else {
      this.setData({
        isAddTip: 0
      })
    }    
    console.log(this.data.isAddTip);
  },

  modTip(){
    console.log("mod Tip");
    if(!this.data.isModTip){
      this.setData({
        isModTip: 1
      })
    }else {
      this.setData({
        isModTip: 0
      })
    }    
    console.log(this.data.isModTip);
  },

  toSchedule(){
    console.log("to Schedule");
    wx.navigateTo({
      url:  "/pages/schedule/schedule"
    })
  },
  
  toDiary(){
    console.log("to Diary");
    wx.redirectTo({
      url:  "/pages/schedule/schedule"
    })
  },

  getData(e) {
    this.setData({
      data: e.detail.value
    });
  },

  test(){
    console.log("test");

  },

  longClick(event){
    console.log("长按");
    console.log(event.currentTarget);
    this.setData({
      data: "changed"
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.logging()
    this.getDate()
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