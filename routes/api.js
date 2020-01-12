var express = require("express");

var router = express.Router();
var fs = require("fs");


// 直接返回本地的json文件
router.all("/*", function (req, res, next) {
    console.log(`req.session`,req.session);
    console.log(`req.params`,`./routes/jsonData/${req.params['0'].split(/\//)[0]}.json`);
    /*
    返回json
        方式1：
            res.format({ json:function(){ res.send("{a:'b'}") } })
        方式2：
            res.json({a:"b"})
    */
    let responseStr = fs.readFileSync(`./routes/jsonData/${req.params['0'].split(/\//)[0]}.json`)
        .toString()
        .split("\n")
        .filter(function (n) {
            return !/^\/\//.test(n)
        })
        .join("");
    res.json(JSON.parse(responseStr));
});


module.exports = router;
