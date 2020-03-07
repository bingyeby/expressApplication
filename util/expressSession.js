var session = require("express-session");
var FillStore = require("session-file-store")(session);

module.exports = session({
    name: 'sessionKey',
    secret: 'qianming',// 用来对session id相关的cookie进行签名
    store: new FillStore(), // 本地存储 session 本地文件，也可以选择其他
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 20 * 60 * 1000// 有效期 单位是毫秒
    }
})
