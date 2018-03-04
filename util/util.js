var colors = require("colors");
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

var log4js = require("log4js");
log4js.configure({
    appenders: {// 附加器
        cheeseLogs: { type: 'file', filename: "cheese.log" },
        console: { type: 'console' }
    },
    categories: { // 种类
        cheese: { appenders: ['cheeseLogs'], level: "error" },
        another: { appenders: ['console'], level: 'trace' },
        default: { appenders: ['console', 'cheeseLogs'], level: 'trace' }
    }
});

module.exports = {
    log4js
};

