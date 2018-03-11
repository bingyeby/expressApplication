var express = require('express');
var router = express.Router();
var fs = require("fs");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* 测试用户登录session处理 */
router.get('/test_session', function (req, res, next) {
  res.send(fs.readFileSync("./public/test-user-login-logout-session.html").toString());
});

module.exports = router;
