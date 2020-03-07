const express = require("express");
const router = express.Router();
const fs = require("fs");
let _ = require('lodash');

let db = require("../db/db.util");
let upload = require("../util/upload");

/*
* 获取老师列表
* */
router.get('/teacher/list', function (req, res, next) {
  db.find('teacher', {}).then((list) => {
    console.log(`list`, list);
    res.json({code: 0, data: list})
  })
});

/*
* 获取老师详情
* */
router.get('/teacher/detail/:id', function (req, res, next) {
  db.m('teacher').findOne({_id: req.params.id}).then((info) => {
    res.json({code: 0, data: info})
  })
});

/*
* 新增老师信息[老师认证]
*   没有此信息则新增,有此信息则修改
*   todo 删除之前的图片
* */
router.post('/teacher/certificate', upload.cdnImgUpload.single('avatar'), async function (req, res, next) {
  console.log(`req`, req.body, req.file);
  let info = await db.m('teacher').findOne({userId: req.body.userId})
  if (!info) {
    await db.m('teacher').insertMany({
      userId: req.body.userId,
      teacherName: req.body.teacherName,
      certificate: req.body.certificate,
      feature: req.body.feature,
      experience: req.body.experience,
      avatar: req.file && req.file.path.replace('\\', '\/'),
    })
  } else {
    await db.m('teacher').update({userId: req.body.userId}, {
      userId: req.body.userId,
      teacherName: req.body.teacherName,
      certificate: req.body.certificate,
      feature: req.body.feature,
      experience: req.body.experience,
      avatar: req.file && req.file.path.replace('\\', '\/'),
    })
  }
  res.json({code: 0, data: '接受了'})
});

/*
* 获取课程列表
* */
router.get('/course/list', function (req, res, next) {
  db.find('course', {}).then((list) => {
    console.log(`list`, list);
    res.json({code: 0, data: list})
  })
});


/*
* 获取课程详情
* */
router.get('/course/detail/:id', function (req, res, next) {
  db.m('course').findOne({_id: req.params.id}).populate('teacher').then((info) => {
    console.log(`info.teacher.avatar`, info.teacher.avatar);
    res.json({code: 0, data: info})
  })
});

/*
* 课程新增
* */
router.post('/course/add', upload.cdnImgUpload.single('poster'), async function (req, res, next) {
  console.log(`req`, req.body, req.file);
  let info = await db.m('course').findOne({_id: req.body._id})
  if (!info) {
    await db.m('course').insertMany({
      courseName: req.body.courseName,
      courseDescribe: req.body.courseDescribe,
      destination: req.body.destination,
      poster: req.file && req.file.path.replace('\\', '\/'),
      teacher: req.body.teacher,
      numTotal: req.body.numTotal,
      numCurrent: req.body.numCurrent,
      beginTime: req.body.beginTime,
      endTime: req.body.endTime,
      deadlineTime: req.body.deadlineTime,
    })
  } else {
    await db.m('course').update({_id: req.body._id}, {})
  }
  res.json({code: 0, data: '新增成功'})
});

// 直接返回本地的json文件
router.all("/*", function (req, res, next) {
  console.log(`req.session`, req.session);
  console.log(`req.params`, `./routes/jsonData/${req.params['0'].split(/\//)[0]}.json`);
  /*
  返回json
      方式1：
          res.format({ json:function(){ res.send("{a:'b'}") } })
      方式2：
          res.json({a:"b"})
  */
  let responseStr = fs.readFileSync(`./routes/jsonData/${req.params['0'].split(/\//)[0]}.json`)
      .toString()
      .split("\n")
      .filter(function (n) {
        return !/^\/\//.test(n)
      })
      .join("");
  res.json(JSON.parse(responseStr));
});


module.exports = router;
