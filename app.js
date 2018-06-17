//app.js
let WD = require("./utils/WD")

App({
  globalData: {
    userInfo: null,
    user: null,
    hasRegistered: false,
    uid: "",
  },
  $wd: null,
  onLaunch: function () {
    //初始化野狗云
    this.$wd = WD.initWD("wild-cock-27187")
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getWDUser() //获取远程用户注册信息
    // 官方登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getWDUser: function() {
    let that = this
    let user = WD.getWDUserInfo().then( (u) => {
      that.globalData.uid = u.uid
      that.globalData.user = u
    } ).catch( err => {
      console.log(err);
    })
  },
  updateWDUserInfo(u) {
    let user = u
    user.avatarUrl = this.globalData.userInfo.avatarUrl
    user.uid = this.globalData.uid
    this.globalData.user = user
  },
  getUser() {
    return this.globalData.user
  },
  jumpToTab(tabName) {
    wx.switchTab({
      url: '../'+ tabName +'/' + tabName
    })
  },
  getWD() {
    return this.$wd
  },
  jumpToPage(pageName) {
    wx.navigateTo ({
      url: '../'+ pageName +'/' + pageName
    })
  },
})