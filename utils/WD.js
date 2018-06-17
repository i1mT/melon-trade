let wilddog = {}
const isTest = false
let mockUser = {
  "6879b49f340bb0c70c9e869f2a42": {
    name:"iimT",
    phone:"",
    identity: 1,
    uid:"6879b49f340bb0c70c9e869f2a42",
    gender: "",
    virturalName: "",
    hideInfo: false
  }
}

const initWD = function (appKey) {
  //引入野狗云支持
  var wd = require('../libs/wilddog/wilddog-weapp-all')
  //初始化野狗云
  var config = {
    syncURL: 'https://' + appKey + '.wilddogio.com',
    authDomain: appKey + '.wilddog.com'
  }
  wd.initializeApp(config)
  wilddog = wd
  return wilddog
}

const getWDUserInfo = function() {
  if(isTest) {
    // 测试
    return new Promise( (resolve, reject) => {
      let user = mockUser["6879b49f340bb0c70c9e869f2a42"]
      resolve(user)
    })
  }

  //野狗云登陆
  return new Promise ((resolve, reject) => {
    wilddog.auth().signInWeapp().then(function (user) {
      resolve(user)
    }).catch(function (err) {
      reject(err)
    })
  })
}

const getRegisterInfo = (uid) => {
  if(isTest) {
    return new Promise((resolve, reject) => {
      let key = mockUser
      resolve(key)
    })
  }

  var ref = wilddog.sync().ref("user");
  return new Promise((resolve, reject) => {
    ref.orderByKey().equalTo(uid).once("value", function (snapshot) {
      resolve(snapshot.val())
    });
  })
}

const addUser = (uid, user) => {
  var ref = wilddog.sync().ref("user");
  return new Promise((resolve, reject) => {
    ref.child(uid).set(user, (err) => {
      resolve(err)
    })
  })
}

/**
 * 
 * @param {*} uid     用户id
 * @param {*} data    要更新的信息，如更新名字 {name: "new name"}
 */
const updateUser = (uid, data) => {
  console.log("更新用户信息");
  console.log(uid);
  
  console.log(data);
  
  var ref = wilddog.sync().ref("user");
  return new Promise((resolve, reject) => {
    if(isTest) resolve(true)

    ref.child(uid).update(data).then(() => {
      console.log("更新成功")
      resolve(true) //更新成功
    }).catch(() => {
      resolve(false) //更新失败
    })
  })
}
async function hasRegisterInfo(uid) {
  return await getRegisterInfo(uid);
}


module.exports = {
  initWD, 
  getWDUserInfo,
  getRegisterInfo,
  addUser,
  updateUser
}