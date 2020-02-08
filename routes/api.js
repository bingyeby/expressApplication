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

router.get('/teacherDetail/:id', function (req, res, next) {
  db.m('teacher').findOne({_id: req.params.id}).then((info) => {
    res.json({code: 0, data: info})
  })
});
router.post('/teacher/teacherInfoList', function (req, res, next) {
  db.m('teacher').find(req.params.teacher).then((info) => {
    res.json({code: 0, data: info})
  })
});

router.get('/course/list', function (req, res, next) {
  db.find('course', {}).then((list) => {
    console.log(`list`, list);
    res.json({code: 0, data: list})
  })
});

router.get('/courseDetail/:id', function (req, res, next) {
  db.m('course').findOne({_id: req.params.id}).then((info) => {
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
