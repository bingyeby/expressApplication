let mongoose = require("./db.connect.js");
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  uuid: {type: String},
  phone: {type: String, default: '19879895889'},// 手机
  username: {type: String},// 姓名
  nickname: {type: String},// 昵称
  password: {type: String},// 密码
  age: {type: Number},// 年龄
  subscription: {type: String},// 签名

  avatar: {type: String, default: '/static/images/user.avatar.1.png'},// 头像
  email: {type: String, default: '19879895889@163.com'},// 邮箱

  registerTime: {type: Date, default: new Date()},// 注册时间
  loginTime: {type: Date, default: new Date()},// 最后登录时间

  teacher: [{type: Schema.Types.ObjectId, ref: 'teacher'}], // 关注的老师
  course: [{type: Schema.Types.ObjectId, ref: 'course'}], // 我的课程
});

let activitySchema = new Schema({
  activityName: {type: String},
  activityMsg: {type: String},
  timeStart: {type: Date},
  timeEnd: {type: Date},
  attendUserIds: {type: Array}
})

let teacherSchema = new Schema({
  userId: {type: String},// 先建立个人账号,在个人账号界面认证(创建)老师, 个人界面通过此id来查询老师信息(是否是老师)
  teacherName: {type: String},// 老师名字
  avatar: {type: String, default: '/static/images/user.avatar.2.png'},// 老师头像
  certificate: {type: Array},// 证书
  feature: {type: String},// 特色
  experience: {type: String},// 心得
  course: [{type: Schema.Types.ObjectId, ref: 'course'}],// 课程列表
  comment: {type: Array}// 评论
})

let courseSchema = new Schema({
  courseName: {type: String},// 课程名称
  courseDescribe: {type: String},// 课程描述
  destination: {type: String},// 地址
  poster: {type: String},// 海报 图片地址

  teacher: {type: Schema.Types.ObjectId, ref: 'teacher'}, // 老师id

  numTotal: {type: Number},// 允许报名人数
  numCurrent: {type: Number},// 当前报名人数

  beginTime: {type: Date},// 课程开始 结束时间
  endTime: {type: Date},// 课程开始 结束时间
  deadlineTime: {type: Date},// 截止时间

  comment: {type: String},// 评论
  question: {type: String},// 提问
  answer: {type: String},// 提问

  publishUser: {type: String},// 发布相关
  publishTime: {type: Date, default: new Date()},// 发布相关
  publishPhone: {type: String},// 发布相关
})

module.exports = {
  user: mongoose.model("user", UserSchema),
  active: mongoose.model("active", activitySchema),
  teacher: mongoose.model("teacher", teacherSchema),
  course: mongoose.model("course", courseSchema),
}
