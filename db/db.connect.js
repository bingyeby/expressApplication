let mongoose = require("mongoose"),
    DB_URL = 'mongodb://localhost:27017/myapp';

mongoose.Promise = global.Promise;

/* connect */
mongoose.connect(DB_URL);

/* connect success */
mongoose.connection.on("connected", function () {
  console.log('Mongoose connection open to ' + DB_URL);
});

/* connect error */
mongoose.connection.on("error", function (err) {
  console.log('Mongoose connection error ' + err);
});

/* connect success */
mongoose.connection.on("disconnected", function () {
  console.log('Mongoose connection disconnected');
});

module.exports = mongoose
