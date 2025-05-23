const db = require("../db");

exports.getAllDresses = (req, res) => {
  let sql =
    "SELECT *, (price * (1 - discount_percentage/100)) as discounted_price FROM dresses";
  db.query(sql, [], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving dresses");
      return;
    }
    res.json(result);
  });
};

exports.getDressById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT *, (price * (1 - discount_percentage/100)) as discounted_price
    FROM dresses
    WHERE id = ?
  `;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving dress details");
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Dress not found" });
      return;
    }
    res.json(result[0]);
  });
};

exports.createDress = (req, res) => {
  const {
    name,
    description,
    price,
    discount_percentage,
    stock_quantity,
    size_available,
    color,
    style,
    material,
    features,
  } = req.body;

  const sql = `
    INSERT INTO dresses (
      name, description, price, discount_percentage, stock_quantity,
      size_available, color, style, material, features
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      description,
      price,
      discount_percentage,
      stock_quantity,
      size_available,
      color,
      style,
      material,
      features,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error creating dress");
        return;
      }
      res.json({
        message: "Dress created successfully",
        id: result.insertId,
      });
    }
  );
};

exports.updateDress = (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    discount_percentage,
    stock_quantity,
    size_available,
    color,
    style,
    material,
    features,
  } = req.body;

  const sql = `
    UPDATE dresses
    SET name = ?, description = ?, price = ?,
        discount_percentage = ?, stock_quantity = ?, size_available = ?,
        color = ?, style = ?, material = ?, features = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name,
      description,
      price,
      discount_percentage,
      stock_quantity,
      size_available,
      color,
      style,
      material,
      features,
      id,
    ],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating dress");
        return;
      }
      res.json({ message: "Dress updated successfully" });
    }
  );
};

exports.deleteDress = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM dresses WHERE id = ?", [id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting dress");
      return;
    }
    res.json({ message: "Dress deleted successfully" });
  });
};
