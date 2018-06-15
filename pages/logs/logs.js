//logs.js
const util = require('../../utils/util.js')
const app  = getApp()

Page({
  data: {
    logs: [],
    user: {}
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    this.setData({
      user: app.globalData.wildUserInfo
    })
  }
})
