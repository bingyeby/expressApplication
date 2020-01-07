let express = require("express");
let router = express.Router();
let fs = require("fs");
let dbConUser = require("../db/db.con.user");
const uuid = require('uuid/v4');
const crypto = require('crypto');

/* 根据userName获取某个用户收藏的物品 */
let collections = {
  "syl": ["1", "2", "5"],
  "by": ["1", "3", "5"],
  "alice": ["1"],
  "amy": ["3"],
  "aa": ["0"]
};

let userInfoList = {
  "syl": "syl",
  "alice": "alice",
  "by": "by",
  "amy": "amy",
  "aa": "11"
};

/* 用户信息确认 */
let findUser = function (username, userpwd) {
  console.log(username, "---", userpwd);
  if (userInfoList[username] === userpwd) {
    return {username, userpwd}
  }
};

// 用户登录
router.post('/userLogin', function (req, res, next) {
  console.log(req.body)
  let md5 = crypto.createHash('md5');
  md5.update(req.body.userpwd);
  let userpwd = md5.digest('hex');// 16进制
  // let user = findUser(req.body.username, userpwd);// 本地测试
  dbConUser.find(req.body.username, userpwd).then(function (res) {// 数据库测试
    if (res.length > 0) {
      console.log("存在用户".blue);
      return Promise.resolve(res[0]);// user
    } else {
      console.log("用户不存在".red);
      return Promise.reject("用户不存在");
    }
  }).then(function (user) {
    console.log(JSON.stringify(user).yellow);
    req.session.regenerate(function (err) {
      if (err) {
        res.json({ret_code: 2, ret_msg: '登录失败'});
      } else {
        req.session.username = user.username;
        console.log("登录成功".blue);
        res.json({ret_code: 0, ret_msg: '登录成功', userInfo: user});
      }
    });
  }).catch(function (error) {
    console.log("账号或密码错误！".red);
    res.json({ret_code: 1, ret_msg: '账号或密码错误！'});
  })
});

// 退出登录
router.get('/logout', function (req, res, next) {
  // 备注：这里用的session-file-store在destroy方法里面，并没有销毁cookie
  // 所以客户端的cookie还是存在，导致退出登陆后服务器端检测到cookie，然后去查找对应的session文件，报错；是session-file-store本身的bug
  req.session.destroy(function (err) {
    if (err) {
      res.json({ret_code: 2, ret_msg: "退出登陆失败"});
    } else {
      res.json({ret_code: 0, ret_msg: "退出登陆成功"});
      res.clearCookie("sessionKey");
      res.redirect("/");
    }
  })
});

// 随意一个查询接口，测试user session
router.get("/list", function (req, res, next) {
  let username = req.session.username;
  console.log("username of session".blue, username);
  if (username) {
    res.json(collections[username]);
  } else {
    res.json({error: "用户未登录"});
  }
});

// 新增用户 0 判断
router.post("/userCreate", function (req, res, next) {
  dbConUser.findByName(req.body.username).then(function (msg) {
    if (msg.length > 0) {
      res.send({code: 1, msg: '用户名已存在'});
    } else {
      next();
    }
  })
})

// 新增用户 1 新增
router.post("/userCreate", function (req, res, next) {
  // {username aa userpwd 11}
  let userid = uuid().replace(/\-/g, '');
  let md5 = crypto.createHash('md5');
  md5.update(req.body.userpwd);
  let userpwd = md5.digest('hex');// 16进制
  let userInfo = {
    userid,
    username: req.body.username,
    userpwd,
    userage: 0,
    logindate: new Date()
  };
  dbConUser.insert(userInfo).then(function () {
    console.log('add one user √');
    res.json({"code": 0});
  }).catch(function () {
    console.log('add one user ×');
    res.json({"code": 1});
  });
})


module.exports = router;
