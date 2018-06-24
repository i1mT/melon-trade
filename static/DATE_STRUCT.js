let user = {
  phone: "",
  identity: "",
  name: "",
  gender: "",
  virturalName: "",
  hideInfo: false,
  addrsss: "",
  avatar: "",
}

let intention = {
  uid: "",
  title: "",
  type: "", 
  cate: "",
  content: "",
  viewer: 0,
  wanted: 0,
  status: 0,
  wantedPrice: 0,
  acturalPrice: 0,
  picList: ""
}

let message = {
    from: "",
    to: "",
    inid: "",
    price: ""
}

module.exports = {
  USER: user,
  INTENTTION: intention,
  MESSAGE: message
}