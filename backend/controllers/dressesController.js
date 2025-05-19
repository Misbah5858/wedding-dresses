const db = require("../db");

exports.getAllDresses = (req, res) => {
  const { category_id } = req.query;
  let sql =
    "SELECT d.*, c.name as category_name, " +
    "(d.price * (1 - d.discount_percentage/100)) as discounted_price " +
    "FROM dresses d " +
    "LEFT JOIN categories c ON d.category_id = c.id";
  if (category_id) {
    sql += " WHERE d.category_id = ?";
  }
  db.query(sql, category_id ? [category_id] : [], (err, result) => {
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
    SELECT d.*, c.name as category_name,
    (d.price * (1 - d.discount_percentage/100)) as discounted_price
    FROM dresses d
    LEFT JOIN categories c ON d.category_id = c.id
    WHERE d.id = ?
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
    category_id,
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
      name, category_id, description, price, discount_percentage, stock_quantity,
      size_available, color, style, material, features
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      category_id,
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
    category_id,
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
    SET name = ?, category_id = ?, description = ?, price = ?,
        discount_percentage = ?, stock_quantity = ?, size_available = ?,
        color = ?, style = ?, material = ?, features = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name,
      category_id,
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
  db.query("SELECT id FROM orders WHERE dress_id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error checking dress references");
      return;
    }
    if (result.length > 0) {
      res.status(400).json({
        error: "Cannot delete dress",
        message: "This dress has existing orders and cannot be deleted",
      });
      return;
    }
    db.query("DELETE FROM dresses WHERE id = ?", [id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error deleting dress");
        return;
      }
      res.json({ message: "Dress deleted successfully" });
    });
  });
};
