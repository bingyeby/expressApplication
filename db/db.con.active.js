/*  */

var activeModel = require("./dbModel").active;

var actives = [
    {
        activityName: "run",
        activityMsg: "run a",
        timeStart: Date.now(),
        timeEnd: Date.now(),
        attendUserIds: ["1", "2"]
    }
];

activeModel
    .create(...actives)
    .then(function (res) {
        console.log(res);
    })
    .catch(function (err) {
        console.log(err);
    })
