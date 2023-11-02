const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  database: "nr_hardware",
  user: "root",
  password: "abcde12345",
});

module.exports = pool;