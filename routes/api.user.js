let express = require("express");
let router = express.Router();
let fs = require("fs");
let dbConUser = require("../db/db.con.user");
const uuid = require('uuid/v4');
const crypto = require('crypto');
let db = require("../db/db.util");
let upload = require("../util/upload");

/* 本地数据集合模拟 */
let listCollect = {
  "syl": ["1", "2", "5"],
  "by": ["1", "3", "5"],
};
let userCollect = {
  "syl": "syl",
};

/*
* 用户信息确认 本地
* */
let findUser = function (username, password) {
  console.log(username, "---", password);
  if (userCollect[username] === password) {
    return {username, password}
  }
};

/*
* 用户登录
* */
router.post('/login', function (req, res, next) {
  let md5 = crypto.createHash('md5');
  md5.update(req.body.password);
  let password = md5.digest('hex');// 16进制
  // let user = findUser(req.body.username, password);// 本地测试
  db.m('user').findOne({phone: req.body.phone, password}).then(function (res) {// 数据库测试
    if (res) {
      console.log("存在用户".blue);
      return Promise.resolve(res);// user
    } else {
      console.log("用户不存在".red);
      return Promise.reject("用户不存在");
    }
  }).then(function (user) {
    console.log(JSON.stringify(user).yellow);
    req.session.regenerate(function (err) {// 使再生；革新
      if (err) {
        res.json({code: -1, data: '登录失败'});
      } else {
        req.session.userId = user._id;
        console.log("登录成功".blue);
        res.json({code: 0, data: user});
      }
    });
  }).catch(function (error) {
    console.log("账号或密码错误！".red);
    res.json({code: -1, data: '账号或密码错误！'});
  })
});

/*
* 退出登录
* */
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

/*
* 用户注册: 判断是否存在
* */
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

/*
* 用户注册: 存储信息
*   req.body  {username: aa, password: 11}
* */
router.post("/register", function (req, res, next) {
  let uuidStr = uuid().replace(/\-/g, '');
  let md5 = crypto.createHash('md5');
  md5.update(req.body.password);
  let password = md5.digest('hex');// 16进制
  let userInfo = {
    uuid: uuidStr,
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
* 密码重置
* */
router.post("/resetPassword", function (req, res, next) {
  let md5 = crypto.createHash('md5');
  md5.update('123');
  let password = md5.digest('hex');// 16进制
  db.m('user').update({phone: req.body.phone}, {password}).then((data) => {
    console.log(`data`, data);
    res.json({
      code: 0,
      data: '密码重置成功!'
    });
  })
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
 * 用户取消关注一个老师
 **/
router.post("/disFollowTeacher", function (req, res, next) {
  db.m('user').update({_id: req.body.userId}, {$pull: {teacher: req.body.teacherId}}).then((n, i) => {
    res.json({
      code: 0,
      data: '已经取消关注!'
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
router.post('/infoUpdate', upload.cdnImgUpload.single('avatar'), async function (req, res, next) {
  console.log(`req.file`, req.file);
  let updateInfo = {
    userId: req.body.userId,
    nickname: req.body.nickname,
    username: req.body.username,
    phone: req.body.phone,
    email: req.body.email,
    subscription: req.body.subscription,
    avatar: req.file && req.file.path.replace('\\', '\/'),
  }
  await db.m('user').update({_id: req.body.userId}, updateInfo)
  res.json({code: 0, data: updateInfo})
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
router.get('/isTeacher', async function (req, res, next) {
  let teacherInfo = await db.m('teacher').findOne({userId: req.query.userId || 'xxx'})
  if (teacherInfo) {
    teacherInfo = teacherInfo.toObject() // 返回值不能操作,只读,需要通过toObject()执行后才可操作
    teacherInfo.courseList = await db.m('course').find({teacher: teacherInfo._id})
  }
  res.json({code: 0, data: teacherInfo})
});

/*
 * 获取报名参加的课程信息
 **/
router.get('/courseList', function (req, res, next) {
  db.m('user').findOne({_id: req.query.userId}).populate('course').then((info) => {
    res.json({code: 0, data: info.course})
  })
});

/*
* 随意一个查询接口，测试user session
* */
router.get("/list", function (req, res, next) {
  if (req.session && req.session.userId) {
    res.json({
      status: 0,
      userId: req.session.userId,
      msg: '用户处于登录状态...'
    });
  } else {
    res.json({error: "用户未登录~"});
  }
});

module.exports = router;
