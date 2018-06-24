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
    hideInfo: false,
    address: "食珍村四社",
    avatar: "",
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

/**
 * 添加一个用户
 * @param {*} uid 用户id
 * @param {*} user 用户信息
 */
const addUser = (uid, user) => {
  var ref = wilddog.sync().ref("user")
  return new Promise((resolve, reject) => {
    ref.child(uid).set(user, (err) => {
      resolve(err)
    })
  })
}

/**
 * 根据ID获取一条意向
 * @param {*} type 意向类型 买0/卖1
 * @param {*} id 意向ID
 */
const getIntentionById = (type, id) => {
  let keyName = type == 1 ? "sell_intention" : "buy_intention"
  var ref = wilddog.sync().ref(keyName)
  return new Promise((resolve, reject) => {
    ref
    .startAt(null, id)
    .limitToFirst(1)
    .once('value', snapshot => {
      resolve(snapshot.val()[id])
    })
  })
}

/**
 * 添加一条意向
 * @param {*} type 意向类型 买/卖
 * @param {*} data 意向内容
 */
const addIntention = (data) => {
  let type = data.type
  delete data["type"]
  let keyName = type == 1 ? "sell_intention" : "buy_intention"
  var ref = wilddog.sync().ref(keyName)
  const time = new Date().getTime()
  return new Promise((resolve, reject) => {
    ref.child(time).set(data, (err) => {
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
  
  var ref = wilddog.sync().ref("user");
  return new Promise((resolve, reject) => {
    if(isTest) resolve(true)

    ref.child(uid).update(data).then(() => {
      resolve(true) //更新成功
    }).catch(() => {
      resolve(false) //更新失败
    })
  })
}
/**
 * 获取一页intention
 * @param {*} type 类型 买0/卖1
 * @param {*} page 页数
 * @param {*} lastKey  如果不是第一页 需要上一页最后一组数据的键值
 */
const getIntention = (type, page, lastKey) => {
  if(!page) page = 1
  let len = 8
  let keyName = type == 1 ? "sell_intention" : "buy_intention"
  var ref = wilddog.sync().ref(keyName)

  return new Promise( (resolve, reject) => {
    if(page == 1) {
      ref
      .orderByKey()
      .limitToFirst(len)
      .on("value", (snapshot) => {
        resolve(snapshot.val())
      })
    } else {
      ref
      .startAt(null, lastKey)
      .limitToFirst(len + 1)
      .once("value", (snapshot) => {
        let vals = snapshot.val()||{}
        delete vals[lastKey]
        resolve(vals)
      })
    }
  })
}

async function hasRegisterInfo(uid) {
  return await getRegisterInfo(uid);
}


module.exports = {
  initWD, 
  getWDUserInfo,
  getRegisterInfo,
  getIntentionById,
  addUser,
  updateUser,
  addIntention,
  getIntention
}