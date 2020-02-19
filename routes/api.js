const express = require("express");
const router = express.Router();
const fs = require("fs");
let _ = require('lodash');

let db = require("../db/db.util");


router.get('/teacher/list', function (req, res, next) {
  db.find('teacher', {}).then((list) => {
    console.log(`list`, list);
    res.json({code: 0, data: list})
  })
});

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
router.post('/teacher/certificate', async function (req, res, next) {
  console.log(`req`, req.body, req.files);
  let filePath = ''
  if (_.size(req.files) > 0) {
    filePath = req.files[0].path
  }
  let info = await db.m('teacher').findOne({userId: req.body.userId})
  if (!info) {
    await db.m('teacher').insertMany({
      userId: req.body.userId,
      teacherName: req.body.teacherName,
      certificate: req.body.certificate,
      feature: req.body.feature,
      experience: req.body.experience,
      avatar: filePath,
    })
  } else {
    await db.m('teacher').update({userId: req.body.userId}, {
      userId: req.body.userId,
      teacherName: req.body.teacherName,
      certificate: req.body.certificate,
      feature: req.body.feature,
      experience: req.body.experience,
      avatar: info.avatar || filePath,
    })
  }
  res.json({code: 0, data: '接受了'})
});

router.get('/course/list', function (req, res, next) {
  db.find('course', {}).then((list) => {
    console.log(`list`, list);
    res.json({code: 0, data: list})
  })
});

router.get('/course/detail/:id', function (req, res, next) {
  db.m('course').findOne({_id: req.params.id}).populate('teacher').then((info) => {
    res.json({code: 0, data: info})
  })
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
