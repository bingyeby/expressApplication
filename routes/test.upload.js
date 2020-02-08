var express = require('express');
var router = express.Router();
var fs = require("fs");

/* 测试用户登录session处理 */
router.get('/test_session', function (req, res, next) {
  res.send(fs.readFileSync("./public/test-user-login-logout-session.html").toString());
});

/* 测试文件上传功能 */
router.get('/test_file_up', function (req, res, next) {
  res.send(fs.readFileSync("./public/test_file_up.html").toString());
});


router.post("/test_file_up", function (req, res, next) {
  // console.log('req.body', req.body);// { pwdword: '1' }
  // console.log('req.files', req.files);// [ { fieldname: 'photo1', originalname: 'QQ图片20180224192348.jpg', encoding: '7bit', mimetype: 'image/jpeg', destination: './upload/', filename: 'c5a91951ddf02af13f24dc80d5d82b12', path: 'upload\\c5a91951ddf02af13f24dc80d5d82b12', size: 232388 }, { fieldname: 'photo2', originalname: 'QQ图片20180224192348.jpg', encoding: '7bit', mimetype: 'image/jpeg', destination: './upload/', filename: 'cf6500c1e15bc28e68bbdd9edff2e770', path: 'upload\\cf6500c1e15bc28e68bbdd9edff2e770', size: 232388 }, { fieldname: 'photo2', originalname: '年轻人.jpg', encoding: '7bit', mimetype: 'image/jpeg', destination: './upload/', filename: 'c73f6b1bb4ff31f8423f099e9d368ee0', path: 'upload\\c73f6b1bb4ff31f8423f099e9d368ee0', size: 408816 } ]
  let photos = {photo1: [], photo2: []};
  req.files.forEach(function (n, i) {
    photos[n.fieldname].push(n.filename);
  });
  console.log('photos', photos);
  // res.json({ "code": "0" });
  res.redirect('/test_file_up');
});

// 通过Ajax方式上传文件(input file)，使用FormData进行Ajax请求 https://www.cnblogs.com/LoveTX/p/7081515.html
router.post("/test_file_up_2", function (req, res, next) {
  console.log('req.body', req.body);// { pwdword: '' }
  console.log('req.files', req.files);// [ { fieldname: 'photo1', originalname: 'QQ图片20180224192348.jpg', encoding: '7bit', mimetype: 'image/jpeg', destination: './upload/', filename: 'c5a91951ddf02af13f24dc80d5d82b12', path: 'upload\\c5a91951ddf02af13f24dc80d5d82b12', size: 232388 }, { fieldname: 'photo2', originalname: 'QQ图片20180224192348.jpg', encoding: '7bit', mimetype: 'image/jpeg', destination: './upload/', filename: 'cf6500c1e15bc28e68bbdd9edff2e770', path: 'upload\\cf6500c1e15bc28e68bbdd9edff2e770', size: 232388 }, { fieldname: 'photo2', originalname: '年轻人.jpg', encoding: '7bit', mimetype: 'image/jpeg', destination: './upload/', filename: 'c73f6b1bb4ff31f8423f099e9d368ee0', path: 'upload\\c73f6b1bb4ff31f8423f099e9d368ee0', size: 408816 } ]
  res.json({"code": "0"});
});

module.exports = router;
