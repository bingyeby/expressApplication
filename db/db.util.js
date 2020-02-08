let modelAll = require("./db.model")
let util = require("../util/util.js");

let _ = require('lodash')

/**
 * 增
 * @param modelName
 * @param info
 * @returns {*}
 */
const add = (modelName, info) => {
  let model = modelAll[modelName]
  return new model(info).save()
}


/**
 * 删
 * @param modelName string
 * @param {*} where {username:"aa"}
 */
const remove = function (modelName, where) {
  let model = modelAll[modelName]
  return userModel.remove(where);// res 中返回是否成功及影响的行数 {"ok":1,"n":1}
}

/**
 * 改
 * @param modelName string
 * @param where
 * @param update
 * @returns {IDBRequest<IDBValidKey>|Promise<void>|void}
 */
const update = function (modelName, where, update) {
  let model = modelAll[modelName]
  return model.update(where, update);
}

/**
 * 查
 * @param modelName
 * @param info
 * @returns {*}
 */
const find = (modelName, info) => {
  let model = modelAll[modelName]
  return model.find(info)
}


const m = (modelName, dealList) => {
  return modelAll[modelName]
}


const deal = (modelName, dealList) => {
  let re = modelAll[modelName]
  _.each(dealList, (value, key) => {
    re = model[key](value)
  })
  return re
}


module.exports = {
  add, remove, update, find, deal, m,
}

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
