let express = require("express");
let router = express.Router();
let fs = require("fs");
let dbConUser = require("../db/db.con.user");
const uuid = require('uuid/v4');
const crypto = require('crypto');
let db = require("../db/db.util");

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
let findUser = function (username, password) {
  console.log(username, "---", password);
  if (userInfoList[username] === password) {
    return {username, password}
  }
};

// 用户登录
router.post('/login', function (req, res, next) {
  console.log(req.body)
  let md5 = crypto.createHash('md5');
  md5.update(req.body.password);
  let password = md5.digest('hex');// 16进制
  // let user = findUser(req.body.username, password);// 本地测试
  dbConUser.find({username: req.body.username, password}).then(function (res) {// 数据库测试
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
        res.json({code: -1, data: '登录失败'});
      } else {
        req.session.username = user.username;
        console.log("登录成功".blue);
        res.json({code: 0, data: user});
      }
    });
  }).catch(function (error) {
    console.log("账号或密码错误！".red);
    res.json({code: -1, data: '账号或密码错误！'});
  })
});

// 退出登录
router.get('/logout', function (req, res, next) {
  // 备注：这里用的session-file-store在destroy方法里面，并没有销毁cookie
  // 所以客户端的cookie还是存在，导致退出登陆后服务器端检测到cookie，然后去查找对应的session文件，报错；是session-file-store本身的bug
  req.session.destroy(function (err) {
    if (err) {
      res.json({code: -1, data: "退出登陆失败"});
    } else {
      res.clearCookie("sessionKey");
      res.json({code: 0, data: "退出登陆成功"}); // res.redirect("/"); // 只能存在一个响应
    }
  })
});

// 新增用户 0 判断
router.post("/register", function (req, res, next) {
  console.log(`req.body`, req.body);
  dbConUser.findByName(req.body.phone).then(function (msg) {
    if (msg.length > 0) {
      res.send({code: -1, data: '该手机号已注册'});
    } else {
      next();
    }
  })
})

// 新增用户 1 新增
router.post("/register", function (req, res, next) {
  // {username: aa, password: 11}
  let userId = uuid().replace(/\-/g, '');
  let md5 = crypto.createHash('md5');
  md5.update(req.body.password);
  let password = md5.digest('hex');// 16进制
  let userInfo = {
    id: userId,
    phone: req.body.phone,
    username: req.body.username,
    password,
    age: 22,
    loginTime: new Date()
  };
  dbConUser.insert(userInfo).then(function (userInfo) {
    console.log('add one user √', userInfo);
    res.json({
      code: 0,
      data: userInfo
    });
  }).catch(function () {
    console.log('add one user ×');
    res.json({"code": 1});
  });
})


/*
 * 用户关注一个老师
 **/
router.post("/followTeacher", function (req, res, next) {
  db.m('user').update({_id: req.body.userId}, {$addToSet: {teacher: req.body.teacherId}}).then((n, i) => {
    res.json({
      code: 0,
      data: '关注成功!'
    });
  })
});

/*
 * 用户报名参加一个课程
 **/
router.post("/attendCourse", function (req, res, next) {
  db.m('user')
      .update({_id: req.body.userId}, {$addToSet: {course: req.body.courseId}})
      .then((n, i) => {
        res.json({
          code: 0,
          data: '报名成功!'
        });
      })
});


/*
* 用户信息更正
* */
router.post('/infoUpdate', async function (req, res, next) {
  console.log(`req`, req.body, req.files);
  let filePath = ''
  if (_.size(req.files) > 0) {
    filePath = req.files[0].path
  }
  await db.m('user').update({userId: req.body.userId}, {
    userId: req.body.userId,
    username: req.body.username,
    phone: req.body.phone,
    email: req.body.email,
    subscription: req.body.subscription,
    avatar: filePath ? filePath : null,
  })
  res.json({code: 0, data: '修改成功'})
});

/*
 * 获取一个用户关注的老师信息
 **/
router.get('/followTeacherList', function (req, res, next) {
  db.m('user')
      .findOne({_id: req.query.userId})
      .populate('teacher')
      .then((info) => {
        console.log(`followTeacherList`, info);
        res.json({code: 0, data: info.teacher})
      })
});


/*
 * 获取一个用户是否是老师的信息
 **/
router.get('/isTeacher', function (req, res, next) {
  db.m('teacher')
      .findOne({userId: req.query.userId})
      .then((info) => {
        console.log(`isTeacher`, info);
        res.json({code: 0, data: info})
      })
});

/*
 * 获取报名参加的课程信息
 **/
router.get('/courseList', function (req, res, next) {
  db.m('user').findOne({_id: req.query.userId}).populate('course').then((info) => {
    res.json({code: 0, data: info.course})
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


module.exports = router;
