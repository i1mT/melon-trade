const QNUploder = require("../../libs/qiniu/qiniuUploader")
const Encrypt   = require("../../libs/qiniu/Encrpt")
const App       = getApp()
const WD        = require("../../utils/WD")
let thisPage  = {}

Page({
  data: {
    picList: [],
    title: "",
    type: 1,
    cate: "",
    content: "",
    wantedPrice: "",
    submitBtnDisabled: false
  },
  onLoad: function(options) {
    //初始化thisPage
    thisPage = this
    this.setData({
      type: App.globalData.user.identity
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
  didPressChooseImage: function() {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        // 交给七牛上传
        let token = Encrypt.genToken()
        console.log(token);
        QNUploder.upload(filePath, (res) => {
          let list = that.data.picList
          let aPic = {
            id: list.length + 1,
            src: res.imageURL
          }
          list.push(aPic)
          that.setData({
            picList: list
          })
          console.log(that.data.picList)
        }, (error) => {
        }, {
          region: 'ECN',
          uploadURL: "https://up-z2.qbox.me",
          domain: 'oqapmzmc9.bkt.clouddn.com',
          key: App.globalData.uid + "-" + (new Date().getTime()/1000) + '.jpg',
          uptoken: token,
          uptokenURL: 'UpTokenURL.com/uptoken',
          uptokenFunc: Encrypt.genToken()
        }, (res) => {
            //上传进度 res.progress
            //已上传数据长度 res.totalBytesSent
            //预期需要上传的数据总长度', res.totalBytesExpectedToSend
        });
      }
    })
  },
  changeTitle( { detail } ) {
    this.setData({
      title: detail.detail.value
    })
  },
  changeCate( { detail } ) {
    this.setData({
      cate: detail.detail.value
    })
  },
  changeWantedPrice( { detail } ) {
    this.setData({
      wantedPrice: detail.detail.value
    })
  },
  changeContent( { detail } ){
    this.setData({
      content: detail.detail.value
    })
  },
  validateInfo() {
    if(this.data.title == "") {
      this.showToast('请填写标题')
      return false
    }
    if(this.data.cate == "") {
      this.showToast('请填写瓜类')
      return false
    }
    if(this.data.wantedPrice == "") {
      this.showToast('请填写你的理想价格')
      return false
    }
    if(this.data.picList == "") {
      this.showToast('请至少上传一张图片')
      return false
    }
    return true
  },
  handelSubmit() {
    if( !this.validateInfo() ) return
    this.setData({
      submitBtnDisabled: true
    })

    let   intention = require("../../static/DATE_STRUCT").INTENTTION
    let   list      = this.data.picList
    const uid       = App.globalData.uid
    let   listRes   = []

    for(var i in list) {
      listRes.push(list[i].src)
    }

    intention.uid           =    uid
    intention.title         =    this.data.title
    intention.type          =    this.data.type
    intention.cate          =    this.data.cate
    intention.content       =    this.data.content
    intention.wantedPrice   =    this.data.wantedPrice
    intention.picList       =    listRes

    console.log(intention)
    
    //submit
    WD.addIntention(intention).then( err => {
      console.log(err)
      
      if(! err) {
        thisPage.showToast("发布成功", "success")
        thisPage.clearIntention()
        setTimeout(() => {
          //TODO: 跳转到Intention详情页
        }, 1000)
      } else {
        thisPage.showToast("发布失败", "none")
      }
      thisPage.setData({
        submitBtnDisabled: false
      })
    })
  },
  clearIntention() {
    this.setData({
      picList: [],
      title: "",
      cate: "",
      content: "",
      wantedPrice: ""
    })
  },
  showToast(title, icon, duration){
    if(!duration) duration = 1000
    if(!icon) icon = "none"
    wx.showToast({
      title: title,
      icon: icon,
      duration: 1000
    })
  }
})