var express = require("express");
var router = express.Router();
var fs = require("fs");
var userC = require("../db/db.con.user");

/* 根据userName获取某个用户收藏的物品 */
var collections = {
    "syl": ["1", "2", "5"],
    "by": ["1", "3", "5"],
    "alice": ["1"],
    "amy": ["3"],
    "aa": ["0"]
};

var userInfoList = {
    "syl": "syl",
    "alice": "alice",
    "by": "by",
    "amy": "amy",
    "aa": "11"
}

/*  */
var findUsesr = function (username, userpwd) {
    console.log(username, "---", userpwd);
    if (userInfoList[username] == userpwd) {
        return { username, userpwd }
    }
};

// 
router.post('/userLogin', function (req, res, next) {
    console.log(req.body)
    console.log(typeof req.body)
    var user = findUsesr(req.body.username, req.body.userpwd);// 本地测试
    userC.find(req.body.username, req.body.userpwd).then(function (res) {
        if (res.length > 0) {
            console.log("存在用户".blue);
            return Promise.resolve(res[0]);// user
        } else {
            console.log("用户不存在".red);
            return Promise.reject("用户不存在");
        }
    }).then(function (user) {
        console.log(JSON.stringify(user).yellow);
        req.session.regenerate(function (err) {
            if (err) {
                res.json({ ret_code: 2, ret_msg: '登录失败' });
            } else {
                req.session.username = user.username;
                console.log("登录成功".blue);
                res.json({ ret_code: 0, ret_msg: '登录成功', userInfo: user });
            }
        });
    }).catch(function (error) {
        console.log("账号或密码错误！".red);
        res.json({ ret_code: 1, ret_msg: '账号或密码错误！' });
    })
});

// 退出登录
router.get('/logout', function (req, res, next) {
    // 备注：这里用的session-file-store在destory方法里面，并没有销毁cookie
    // 所以客户端的cookie还是存在，导致退出登陆后服务器端检测到cookie，然后去查找对应的session文件，报错；是session-file-store本身的bug
    req.session.destroy(function (err) {
        if (err) {
            res.json({ ret_code: 2, ret_msg: "退出登陆失败" });
        }else{
            res.json({ ret_code: 0, ret_msg: "退出登陆成功" });
            res.clearCookie("sessionKey");
            res.redirect("/");
        }
    })
});

router.get("/list", function (req, res, next) {
    var username = req.session.username;
    console.log("username of session".blue, username);
    if (username) {
        res.json(collections[username]);
    } else {
        res.json({ error: "用户未登录" });
    }
});

router.post("/userCreate", function (req, res, next) {
    // {username aa userpwd 11}
    userC.insert(req.body).then(function () {
        res.json({ "code": 1 });
    }).catch(function () {
        res.json({ "code": 0 });
    })
})

router.post("/*", function (req, res, next) {
    console.log(req.session);
    /* 
    返回json
        方式1：
            res.format({
                json:function(){
                    res.send("{a:'b'}")
                }
            })
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
