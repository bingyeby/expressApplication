var mongoose = require("./db.connect.js");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  userid: {
    type: String
  },
  username: {
    type: String
  },
  userpwd: {
    type: String
  },
  userage: {
    type: Number
  },
  logindate: {
    type: Date
  }
});

var activitySchema = new Schema({
  activityName: {
    type: String
  },
  activityMsg: {
    type: String
  },
  timeStart: {
    type: Date
  },
  timeEnd: {
    type: Date
  },
  attendUserIds: {
    type: Array
  }
})

module.exports = {
  user: mongoose.model("user", UserSchema),
  active: mongoose.model("active", activitySchema)
}
