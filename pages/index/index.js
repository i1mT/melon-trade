let   thisPage  = {}
const App       = getApp()
const WD        = require("../../utils/WD")

Page({
  data: {
    current_tab: 'sell-tab',
    is_sell_tab: true,
    buyCurPage: 1,
    sellCurPage: 1,
    buyInfo: [],
    sellInfo: [],
    hidden:true, 
    scrollTop : 0, 
    scrollHeight:0
  },
  onLoad: function(options) {
    //Do some initialize when page load.
    thisPage = this
    wx.getSystemInfo({ 
      success:function(res){
        thisPage.setData({
          scrollHeight:res.windowHeight 
        })
      }
    })

    if(App.globalData.user.identity == 0) {
      this.setData({
        current_tab: 'sell-tab',
        is_sell_tab: true
      })
    } else {
      this.setData({
        current_tab: 'purc-tab',
        is_sell_tab: false
      })
    }
    //this.init()
  },
  onReady: function() {
    //Do some when page ready.
    
  },
  onShow: function() {
    //Do some when page show.
    this.init()
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
  onScroll(event) {
    this.setData({ 
      scrollTop: event.detail.scrollTop
    })
  },
  scrollToLower(){
    this.refresh()
  },
  scrollToUpper() {
  },
  init() {
    //buy
    WD.getIntention(0, this.data.buyCurPage).then( res => {
      res = this.formatRes(res)
      this.setData({
        buyInfo: res
      })
    })
    //sell
    WD.getIntention(1, this.data.sellCurPage).then( res => {
      res = this.formatRes(res)
      
      this.setData({
        sellInfo: res
      })
    })
  },
  refresh(){
    let type = 0
    let page = 0
    let lastKey = ""
    let opeList = []
    if(this.data.current_tab == 'sell-tab') {
      type = 1
      this.setData({
        sellCurPage: this.data.sellCurPage + 1
      })
      page = this.data.sellCurPage
      lastKey = this.getLastKey(this.data.sellInfo)
      opeList = this.data.sellInfo
    } else {
      this.setData({
        buyCurPage: this.data.buyCurPage + 1
      })
      page = this.data.buyCurPage
      lastKey = this.getLastKey(this.data.buyInfo)
      opeList = this.data.buyInfo
    }
    // get new
    WD.getIntention(type, page, lastKey).then(res => {
      res = this.formatRes(res)
      for(var k in res) {
        opeList[k] = res[k]
      }
      if(this.data.current_tab == 'sell-tab') {
        thisPage.setData({
          sellInfo: opeList
        })
      } else {
        thisPage.setData({
          buyInfo: opeList
        })
      }
    })
  },
  formatRes(res) {
    const Utils = require("../../utils/util")
    let time = ""
    for(var k in res) {
      time = Utils.getDateDiff(k.toString())
      res[k]["time"] = time
      res[k]["id"]   = k
    }
    return res
  },
  handleTabChange({ detail }) {
    this.setData({
      current_tab: detail.key,
      is_sell_tab: detail.key == "sell-tab"
    })
    //TODO: 更改TAB之后的页面处理
  },
  getLastKey (o) {
    let k = ""
    for (var key in o) {
      k = key
    }
    return k
  },
  jumptoDetail(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '../intention/intention?id=' + id
    })
  }
})