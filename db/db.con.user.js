const utill = require("../util/util.js");

let userModel = require("./dbModel").user;
let log = utill.log4js.getLogger("db.con.user.js");


log.debug("a");

// 数据插入
exports.insert = function (user) {
    return new userModel(user).save();
};

/**
 * 根据username进行查找
 * @param {*username} username 
 */
exports.findByName = function (username) {
    var where = { username };
    return userModel.find(where);
}


// 数据查找 用户名+密码
exports.find = function (username, userpwd) {
    var where = {
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

// 修改
exports.update = function (where, update) {
    return userModel.update({ username: "aa" }, { userpwd: "22" }); // 用户aa修改密码为22
}

exports.findByIdAndUpdate = function (id) {
    return userModel.findByIdAndUpdate("id", { userpwd: "22" }).then(function (res) {
        return Promise.resolve({ code: "success" });
    }).catch(function (err) {
        console.log(JSON.stringify(err).red);
        return Promise.reject({ code: "error" })
    });
}

/**
 * 移除
 * @param {*条件} where {username:"aa"}
 */
exports.remove = function (where) {
    return userModel.remove(where);// res 中返回是否成功及影响的行数 {"ok":1,"n":1}
}

// 期待添加的用户信息
var users = [
    { username: "aa", userpwd: "11", userage: 18, logindate: Date.now() },
    { username: "bb", userpwd: "22", userage: 18, logindate: Date.now() }
];

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
