let wilddog = {}
const initWD = function (appKey) {
  //引入野狗云支持
  var wd = require('../wilddog-weapp-all')
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

async function hasRegisterInfo(uid) {
  return await getRegisterInfo(uid);
}


module.exports = {
  initWD, 
  getWDUserInfo,
  getRegisterInfo,
  addUser
}