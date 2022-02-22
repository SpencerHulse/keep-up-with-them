const mysql = require("mysql2");
require("dotenv").config();

// Connect to database
const db = mysql.createConnection({
  host: "localhost",
  // Your MySQL username
  user: "root",
  // Your MySQLpassword
  password: process.env.passwordENV,
  database: "employeeTracker",
});

module.exports = db;
