let activeModel = require("./db.model").active;

let actives = [
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
      console.log(`res`, res);
    })
    .catch(function (err) {
      console.log(`err`, err);
    })
