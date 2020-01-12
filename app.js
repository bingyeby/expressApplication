var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var util = require("./util/util");
var log4js = util.log4js;
var log = log4js.getLogger("cheese");

var app = express();


//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));// 普通POST数据

let multer = require('multer')({dest: './upload/'});
app.use(multer.any());// 文件POST数据

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require("./util/sessionUtil")); // session

app.use('/', require('./routes/index'));
app.use('/api/user', require('./routes/api.user')); // 后台接口
app.use('/api/active', require('./routes/api.active')); // 后台接口
app.use('/api', require('./routes/api')); // 后台接口

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.error(`err`, err);
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(4000, function () {
  console.log("app start!")
  console.log("http://localhost:3000/");
});
module.exports = app;
