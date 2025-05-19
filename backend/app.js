const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Get all dress categories
app.get("/categories", (req, res) => {
  const sql = "SELECT * FROM categories";
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving categories");
      return;
    }
    res.json(result);
  });
});

// Get all dresses with optional category filter
app.get("/dresses", (req, res) => {
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
});

// Get single dress details
app.get("/dresses/:id", (req, res) => {
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
});

// Create new dress
app.post("/dresses", (req, res) => {
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
});

// Update dress
app.put("/dresses/:id", (req, res) => {
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
});

// Delete dress
app.delete("/dresses/:id", (req, res) => {
  const { id } = req.params;

  // First check if the dress is referenced in any orders
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

    // If no orders reference this dress, proceed with deletion
    db.query("DELETE FROM dresses WHERE id = ?", [id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error deleting dress");
        return;
      }
      res.json({ message: "Dress deleted successfully" });
    });
  });
});

// Create new order
app.post("/orders", (req, res) => {
  const {
    customer_name,
    dress_id,
    size,
    quantity,
    color,
    phone,
    email,
    shipping_address,
    special_notes,
    payment_method,
    subtotal,
    discount_amount,
    total_amount,
  } = req.body;

  // Start a transaction to handle stock update and order creation
  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error starting transaction");
      return;
    }

    // Check stock availability
    const checkStockSql = "SELECT stock_quantity FROM dresses WHERE id = ?";
    db.query(checkStockSql, [dress_id], (err, result) => {
      if (err || !result.length) {
        return db.rollback(() => {
          res.status(500).send("Error checking stock");
        });
      }

      const currentStock = result[0].stock_quantity;
      if (currentStock < quantity) {
        return db.rollback(() => {
          res.status(400).json({
            error: "Insufficient stock",
            available: currentStock,
          });
        });
      }

      // Update stock quantity
      const updateStockSql =
        "UPDATE dresses SET stock_quantity = stock_quantity - ? WHERE id = ?";
      db.query(updateStockSql, [quantity, dress_id], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).send("Error updating stock");
          });
        }

        // Create order
        const createOrderSql = `
          INSERT INTO orders (
            customer_name, dress_id, size, quantity, color,
            phone, email, shipping_address, special_notes,
            payment_method, subtotal, discount_amount, total_amount
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          createOrderSql,
          [
            customer_name,
            dress_id,
            size,
            quantity,
            color,
            phone,
            email,
            shipping_address,
            special_notes,
            payment_method,
            subtotal,
            discount_amount,
            total_amount,
          ],
          (err, result) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).send("Error creating order");
              });
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).send("Error committing transaction");
                });
              }
              res.json({
                message: "Order created successfully",
                orderId: result.insertId,
              });
            });
          }
        );
      });
    });
  });
});

// Get all orders
app.get("/orders", (req, res) => {
  const sql = `
        SELECT o.*, d.name as dress_name, d.price as dress_price,
               d.discount_percentage
        FROM orders o
        LEFT JOIN dresses d ON o.dress_id = d.id
        ORDER BY o.created_at DESC
    `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving orders");
      return;
    }
    res.json(result);
  });
});

// Get single order
app.get("/orders/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
        SELECT o.*, d.name as dress_name, d.price as dress_price,
               d.discount_percentage
        FROM orders o
        LEFT JOIN dresses d ON o.dress_id = d.id
        WHERE o.id = ?
    `;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving order");
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json(result[0]);
  });
});

// Update order
app.put("/orders/:id", (req, res) => {
  const { id } = req.params;
  const {
    customer_name,
    size,
    color,
    phone,
    email,
    shipping_address,
    special_notes,
    order_status,
  } = req.body;

  const sql = `
        UPDATE orders
        SET customer_name = ?, size = ?, color = ?,
            phone = ?, email = ?, shipping_address = ?,
            special_notes = ?, order_status = ?
        WHERE id = ?
    `;

  db.query(
    sql,
    [
      customer_name,
      size,
      color,
      phone,
      email,
      shipping_address,
      special_notes,
      order_status,
      id,
    ],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating order");
        return;
      }
      res.json({ message: "Order updated successfully" });
    }
  );
});

// Cancel order
app.put("/orders/:id/cancel", (req, res) => {
  const { id } = req.params;

  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error starting transaction");
      return;
    }

    // Get order details
    const getOrderSql = `
      SELECT dress_id, quantity, order_status
      FROM orders
      WHERE id = ?
    `;

    db.query(getOrderSql, [id], (err, result) => {
      if (err || !result.length) {
        return db.rollback(() => {
          res.status(500).send("Error retrieving order");
        });
      }

      const order = result[0];
      if (order.order_status === "cancelled") {
        return db.rollback(() => {
          res.status(400).json({ message: "Order is already cancelled" });
        });
      }

      // Update stock quantity
      const updateStockSql =
        "UPDATE dresses SET stock_quantity = stock_quantity + ? WHERE id = ?";
      db.query(updateStockSql, [order.quantity, order.dress_id], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).send("Error updating stock");
          });
        }

        // Update order status
        const updateOrderSql =
          "UPDATE orders SET order_status = 'cancelled' WHERE id = ?";
        db.query(updateOrderSql, [id], (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).send("Error updating order status");
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).send("Error committing transaction");
              });
            }
            res.json({ message: "Order cancelled successfully" });
          });
        });
      });
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
