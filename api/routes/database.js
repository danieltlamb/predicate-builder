var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  res.send(`Database Connection API: ${req.query.request}`);
});

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "sessionsapp",
  password: "Password123"
  // database: "all_sessions"
});

connection.connect();

// connection.query("SELECT 1 + 1 AS solution", function(err, rows, fields) {
//   if (err) throw err;

//   console.log("The solution is: ", rows[0].solution);
// });

console.log("database connected");

connection.end();

module.exports = router;
