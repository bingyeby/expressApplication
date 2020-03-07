var express = require('express');
var router = express.Router();
var fs = require("fs");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});
router.get('/404', function (req, res, next) {
  res.render('index', {title: '404'});
});
module.exports = router;
