// pages/diaryView/diaryView.js
const WXAPI = require("apifm-wxapi")
WXAPI.init("ottolsq")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "/resources/img/user.svg",

    startX: 0, // 起始触摸点的X坐标
    isSliding: false, // 是否正在滑动
    focus: false,
    notEdit: false,

    diary: "",

    mode: 0, // 0表示浏览模式，1表示新增模式，2表示编辑模式，3表示确认提交
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

    return `${year}.${month}.${day} ${hours}:${minutes}`
  },

  formatTime_(timestamp){
    let date = new Date(timestamp);

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = date.getDate();
    return `${year}年${month}月${day}日`
  },

  getTipIndex(id) {
    let list  = wx.getStorageSync("diaryList")
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        return i
      } 
    }
  },

  // 滑动换页
  handleTouchMove(e) {
    if(this.data.mode){return}

    if (!this.data.isSliding) {
      this.setData({
        startX: e.touches[0].pageX, // 记录起始触摸点的X坐标
        isSliding: true, // 开始滑动
      });
    }
  },
 
  handleTouchEnd(e) {
    if (this.data.isSliding) {
      const endX = e.changedTouches[0].pageX; // 结束触摸点的X坐标
      const deltaX = endX - this.data.startX; // 计算滑动的距离
 
      let index = this.getTipIndex(this.data.diary.id)
      // 根据滑动的距离判断是否应该跳转到下一页
      // 这里假设向右滑动（deltaX > 0）时跳转到下一页
      if (deltaX > 50) { // 50是一个阈值，你可以根据需要调整
        let diary
        if (index == wx.getStorageSync("diaryList").length - 1) {
          diary = wx.getStorageSync("diaryList")[0]
        }else {
          diary = wx.getStorageSync("diaryList")[index+1]
        }
        diary.updatetime = this.formatTime(diary.updatetime)
        this.setData({
          diary: diary
        })
        
      }else if(deltaX < -50) {
        let diary = wx.getStorageSync("diaryList")[index-1]
        if (index == 0) {
          diary = wx.getStorageSync("diaryList")[wx.getStorageSync("diaryList").length - 1]
        } else {
          diary = wx.getStorageSync("diaryList")[index-1]
        }
        diary.updatetime = this.formatTime(diary.updatetime)
        this.setData({
          diary: diary
        })
      }

      this.setData({
        isSliding: false, // 重置滑动状态
      });
    }
  },

  // 生成id
  generateId() {
    return Date.now() % 1000000000 + Math.floor(Math.random()*10);
  },

  mode_0(id) {
    this.setData({
      mode: 0
    })

    let index = this.getTipIndex(id)
    console.log(index);
    let diary = wx.getStorageSync("diaryList")[index]
    diary.updatetime = this.formatTime(diary.updatetime)

    this.setData({
      diary: diary,
      notEdit: true
    })

    if(wx.getStorageSync("userToken")){
      // console.log(wx.getStorageSync("userToken"));
      console.log("logined")
      this.setData({
        avatarUrl: wx.getStorageSync("avatarUrl"),
      })
    } else {
      console.log("not login")
      // console.log(this.data.diary);
    }
  },

  mode_1() {
    // new diary
    let diary = {
      id: this.generateId(),
      title: this.formatTime_(Date.now()),
      data: "",
      updatetime: Date.now(),
    }
    let newdiary = []
    
    if (wx.getStorageSync("diaryList").length == 0) {
      // console.log("0");
      newdiary.push(diary)
    } else {
      newdiary = wx.getStorageSync("diaryList")
      newdiary.push(diary)
    }
    
    wx.setStorageSync("diaryList", newdiary)
    // console.log(wx.getStorageSync("diaryList"));
    diary.updatetime = this.formatTime(diary.updatetime)
    this.setData({
      mode: 1,
      diary: diary
    })
  },

  // mode_2() {},

  getfocus() {
    this.setData({
      focus: !this.data.focus
    })
  },

  getTitle(e) {
    let diary = this.data.diary
    diary.title = e.detail.value
    this.setData({
      diary: diary
    })
  },

  getData(e) {
    let diary = this.data.diary
    diary.data = e.detail.value
    this.setData({
      diary: diary
    })
  },

  cancel() {
    wx.navigateBack()
  },

  modJson() {
    const userToken = wx.getStorageSync("userToken")
    if(!userToken){
      console.log("not login");
      return
    }

    WXAPI.jsonSet({
      type: "diary",
      token: userToken.token,
      refId: wx.getStorageSync("userToken").uid,
      id: wx.getStorageSync("userDiaryListId"),
      content: '{"msg": '+ JSON.stringify(wx.getStorageSync("diaryList"))+ '}'
    }).then(res => {
      // console.log(wx.getStorageSync("diaryList"));
      // console.log("error");
    })
  },

  // 提交
  handle() {
    if(this.data.mode == 1) {
      this.setData({
        mode: 3
      })
    }

    let diaryList = wx.getStorageSync("diaryList")
    let diary = this.data.diary
    diary.updatetime = diaryList[this.getTipIndex(this.data.diary.id)].updatetime
    diaryList[this.getTipIndex(this.data.diary.id)] = diary
    wx.setStorageSync("diaryList", diaryList)


    // console.log(wx.getStorageSync("diaryList"));

    this.modJson()
    wx.navigateBack()
  },

  edit() {
    this.setData({
      mode: 2,
      notEdit: false,
      focus: true
    })
  },

  delete() {
    let diaryList = wx.getStorageSync("diaryList")

    diaryList.splice(this.getTipIndex(this.data.diary.id), 1);
    wx.setStorageSync("diaryList", diaryList)

    console.log(wx.getStorageSync("diaryList"));
    this.modJson()
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let id = options.diaryId
    if (wx.getStorageSync("userToken")) {
      this.setData({
        avatarUrl: wx.getStorageSync("avatarUrl")
      })
    }


    // console.log(wx.getStorageSync("diaryList"));
    if(id == -1) {
      console.log("plus");
    
      this.mode_1()  
    }else{
      console.log("let me see");
      this.mode_0(id)
    }
    // console.log(wx.getStorageSync("diaryList"));
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
    console.log("onUnload");

    if(this.data.mode == 1) {
      let list = wx.getStorageSync("diaryList")
      list.pop();
      wx.setStorageSync("diaryList", list)
      // console.log(wx.getStorageSync("diaryList"));
    }
    
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