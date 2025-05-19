const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "wedding_dresses",
});

db.connect((error) => {
  if (error) {
    console.error("Error connecting to database:", error);
  } else {
    console.log("Successfully connected to the database");
  }
});

module.exports = db;
