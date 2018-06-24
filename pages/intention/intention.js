const WD  = require("../../utils/WD")
const App = getApp()

Page({
  data: {
    id: "",
    type: 0,
    info: {},
    Uinfo: {}
  },
  onLoad: function(options) {
    //Do some initialize when page load.
    this.setData({
      id: options.id,
      type: options.type
    })
    WD.getIntentionById(this.data.type, this.data.id).then(res => {
      this.setData({
        info: res
      })
      console.log(res);
      
      this.getUserInfo(res.uid)
    })
  },
  onReady: function() {
    //Do some when page ready.
    
  },
  onShow: function() {
    //Do some when page show.
    
  },
  onHide: function() {
    //Do some when page hide.
    
  },
  onUnload: function() {
    //Do some when page unload.
    
  },
  onPullDownRefresh: function() {
    //Do some when page pull down.
    
  },
  getUserInfo(id) {
    WD.getRegisterInfo(id).then(res => {
      console.log(res[id]);

      this.setData({
        Uinfo: res[id]
      })
      
    })
  }
})