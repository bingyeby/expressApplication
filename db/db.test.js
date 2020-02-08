let _ = require('lodash')
let db = require('./db.util')
let mongoose = require("mongoose")
let moment = require("moment")

let teacherM = db.m('teacher')
let courseM = db.m('course')
let teacher = new teacherM({
  _id: new mongoose.Types.ObjectId(),
  teacherName: '唐杰',// 老师名字
  certificate: ['梦想家智慧教育乐园教学总监', '中国创客教育联盟会员'],// 证书
  feature: '从事教育行业10年,注重培养学员的兴趣',// 特色
  experience: '以人为本,寓教于乐,多思考,多尝试',// 心得
  // course: ['_id123'],// 课程列表
  comment: ['教师的教学效果极佳，可以使同学在领略知识魅力的同时提高自己实际技能。']// 评价
});

teacher.save((err) => {
  console.log(`err`, err);
  if (err) return;
  console.log(`teacher._id`, teacher._id);
  let course = new courseM({
    teacher: teacher._id,   // assign the _id from the person
    courseName: '广州青少儿智慧3D打印兴趣班',// 课程名称
    courseDescribe: '3D打印是一种快速成型技术，有别于传统的打印技术。它是一种以数字模型文件为基础，运用粉末状金属或塑料材料等可粘合材料，通过逐层打印的方式来构造物体的增材制造技术。3D打印可以通过3D打印笔或3D打印机-电脑建模实现三维物品的打印创作。',// 课程描述
    destination: '上海市宝山区上大路99号',// 上课地点
    numTotal: '50',// 允许报名人数
    numCurrent: '11',// 当前报名人数
    beginTime: moment().subtract(9, 'days')._d,// 课程开始 结束时间
    endTime: moment().subtract(2, 'days')._d,// 课程开始 结束时间
    deadlineTime: moment().subtract(2, 'days')._d,// 课程开始 结束时间
    comment: '评论',// 评论
    question: '提问',// 提问
    answer: '回答',// 回答
    publishUser: '李鑫',// 发布相关
    publishTime: moment().subtract(11, 'days')._d,// 发布相关
    publishPhone: '13876597785',// 发布相关
  })
  db.m('teacher').update({_id: teacher._id}, {$push: {course: course._id}})
  course.save()
})

// db.find('course', {courseName: '123'})
//     .populate('teacher')
//     .then((list) => {
//       console.log(`list`, list);
//     })

/*
* 通过执行下面逻辑向数据库添加数据
* */
// add('course', {
//   courseName: '11',// 课程名称
//   courseDescribe: '11',// 课程描述
//   teacherId: '11',// 老师id
//   numTotal: '11',// 允许报名人数
//   numCurrent: '11',// 当前报名人数
//   begin: '11',// 课程开始 结束时间
//   end: '11',// 课程开始 结束时间
//   comment: '11',// 评论
//   question: '11',// 提问
//   answer: '11',// 提问
// })
// add('teacher', {
//   teacherName: '111',// 老师名字
//   certificate: '111',// 证书
//   feature: '111',// 特色
//   experience: '111',// 心得
//   course: '111',// 课程列表
//   comment: '111'// 评论
// })
// find('teacher').then((list) => {
//   console.log(`list`, list);
// })
