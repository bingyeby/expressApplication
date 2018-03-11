var express = require("express");

var router = express.Router();
var fs = require("fs");


// 直接返回本地的json文件
router.post("/*", function (req, res, next) {
    console.log(req.session);
    /* 
    返回json
        方式1：
            res.format({ json:function(){ res.send("{a:'b'}") } })
        方式2：
            res.json({a:"b"})
    */
    var responseStr = fs.readdirSync(`./jsonData/${req.params[0]}.json`)
        .toString()
        .split("\n")
        .filter(function (n) {
            return !/^\/\//.test(n);
        })
        .join("");
    res.json(JSON.parse(responseStr));
})


module.exports = router;
