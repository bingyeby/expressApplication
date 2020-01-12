let userModel = require("./db.model").user;

let util = require("../util/util.js");
let log = util.log4js.getLogger("db.con.user.js");
log.debug("run user DB controller");

/**
 * 添加用户 {}
 * @param user
 */
exports.insert = function (user) {
  return new userModel(user).save();
};

/**
 * 根据username进行查找
 * @param username
 * @returns {*}
 */
exports.findByName = function (username) {
  let where = {username};
  return userModel.find(where);
}


/**
 * 数据查找 用户名+密码
 * @param username
 * @param userpwd
 * @returns {*}
 */
exports.find = function (username, userpwd) {
  let where = {
    username,
    userpwd
  };
  return userModel.find(where, function (err, res) {
    if (err) {
      console.log("user find error");
    } else {
      console.log("user find");
      console.log(JSON.stringify(res));
    }
  })
};

/**
 * 修改
 * @param where
 * @param update
 * @returns {IDBRequest<IDBValidKey>|Promise<void>|void}
 */
exports.update = function (where, update) {
  return userModel.update({username: "aa"}, {userpwd: "22"}); // 用户aa修改密码为22
}


/**
 * 通过id查找并修改数据
 * @param id
 * @returns {Promise<T | never>}
 */
exports.findByIdAndUpdate = function (id) {
  return userModel.findByIdAndUpdate("id", {userpwd: "22"}).then(function (res) {
    return Promise.resolve({code: "success"});
  }).catch(function (err) {
    console.log(JSON.stringify(err).red);
    return Promise.reject({code: "error"})
  });
}

/**
 * 移除
 * @param {*} where {username:"aa"}
 */
exports.remove = function (where) {
  return userModel.remove(where);// res 中返回是否成功及影响的行数 {"ok":1,"n":1}
}


/*
* 通过执行下面逻辑向数据库添加数据
* */
// 期待添加的用户信息
// let users = [
//   {username: "aa", userpwd: "11", userage: 18, logindate: Date.now()},
//   {username: "bb", userpwd: "22", userage: 18, logindate: Date.now()}
// ];

// 创建用户
// userModel.create(...users).then(function (doc) {
//     console.log(doc);
// });

// 创建用户
// userModel.insertMany(users).then(function () {
// });

// 查找并筛选结果
// userModel.find({ username: "aa" })
//     .select("username userage -_id")
//     .then(function (res) {
//         console.log(res)
//     });
