const app       = getApp()
const WD        = require("../../utils/WD")
const { $Message } = require('../../dist/base/index');

Page({
  data: {
    userInfo: {},
    virtualNameVisible: false,
    phoneVisible: false,
    addressVisible: false
  },
  onLoad: function(options) {
    //Do some initialize when page load.
    this.setData({
      userInfo: app.getUser()
    })
    console.log(this.data.userInfo);
    
    
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
  changeShowInfo({ detail }) {
    let user = this.data.userInfo
    user.hideInfo = detail.value
    this.setData({
      userInfo: user
    })
    this.updateUser("hideInfo")
  },
  handelVirturalNameModal() {
    let action = !this.data.virtualNameVisible
    this.setData({
      virtualNameVisible: action
    })
  },
  handelPhoneModal() {
    let action = !this.data.phoneVisible
    this.setData({
      phoneVisible: action
    })
  },
  handelAddressModal() {
    let action = !this.data.addressVisible
    this.setData({
      addressVisible: action
    })
  },
  changeVirturalName({detail}) {
    let user = this.data.userInfo
    user.virtualName = detail.detail.value
    this.setData({
      userInfo: user
    })
  },
  changePhone({detail}) {
    let user = this.data.userInfo
    user.phone = detail.detail.value
    this.setData({
      userInfo: user
    })
  },
  changeAddress({detail}) {
    let user = this.data.userInfo
    user.address = detail.detail.value
    this.setData({
      userInfo: user
    })
  },
  submitChangePhone() {
    this.handelPhoneModal()
    this.updateUser("phone")
  },
  submitChangeAddress() {
    this.handelAddressModal()
    this.updateUser("address")
  },
  submitChangeVirtualName() {
    this.handelVirturalNameModal()
    
    this.updateUser("virtualName")
  },
  updateUser(key) {
    let uid = this.data.userInfo.uid
    let data = {}
    console.log(this.data.userInfo.virtualName);
    
    data[key] = this.data.userInfo[key]
    console.log(data);
    
    //调用wd更新用户信息
    WD.updateUser(uid, data).then( res => {
      //更新成功
      if(res) {
        $Message({
          content: 'asdasd',
          type: 'success'
        });
      } else {
        $Message({
          content: '更新失败',
          type: 'error'
        });
      }
    })
  }
})