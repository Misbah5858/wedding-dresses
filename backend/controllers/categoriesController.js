const db = require("../db");

exports.getAllCategories = (req, res) => {
  const sql = "SELECT * FROM categories";
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving categories");
      return;
    }
    res.json(result);
  });
};
