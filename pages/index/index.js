//index.js
//获取应用实例
const app = getApp()
const WD  = require("../../utils/WD")

Page({
  data: {
    showSelectIdentity: false,
    motto: '',
    userInfo: {},
    WDUserInfo: {},
    identity: -1,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.setMotto("正在登陆...")
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.setMotto("正在登陆...")
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.setMotto("正在登陆...")
        }
      })
    }
    //检查是否注册
    this.getWDUser()
  },
  handleClick() {
    console.log('clicked');
  },
  getWDUser() {
    let that = this
    let user = WD.getWDUserInfo().then( (u) => {
      that.data.WDUserInfo = u
      console.log(u);
      
      that.checkRegister(u.uid)
    } ).catch( err => {
      console.log(err);
    })
  },
  checkRegister(uid) {
    // uid += "1"
    WD.getRegisterInfo(uid).then(res => {
      if(!res) {
        //新用户
        console.log("新用户");
        this.setData({
          showSelectIdentity: true
        })
      } else {
        res = res[uid]
        //已注册用户
        console.log("已注册用户");
        this.data.WDUserInfo = res
        app.updateWDUserInfo(res)
        this.setMotto("欢迎你")
        setTimeout( _ => {
          this.toIndex()
        }, 700)
      }
      console.log();
      
    }).catch( err => {
      console.log(err);
    })
  },
  setMotto(text) {
    let plusText = "，" + text
    this.setData({
      motto: this.data.userInfo.nickName + plusText
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  handleSelectFarmer() {
    this.identity = 1
    this.register()
  },
  handleSelectTrader() {
    this.identity = 0
    this.register()
  },
  register() {
    let uid = this.data.WDUserInfo.uid
    let user = {
      phone: this.data.WDUserInfo.phone,
      identity: this.identity,
      name: this.data.WDUserInfo.displayName
    }
    WD.addUser(uid ,user).then( err => {
      if(err == null) {
        //更新全局的wildUser信息
        user.uid = uid
        app.updateWDUserInfo(user)
        this.setData({
          showSelectIdentity: false
        })
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 1000,
          success: this.toIndex
        })
      }
    })
  },
  toIndex() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  }
})
