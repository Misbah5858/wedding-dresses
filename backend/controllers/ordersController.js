const db = require("../db");

exports.createOrder = (req, res) => {
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

  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error starting transaction");
      return;
    }
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
      const updateStockSql =
        "UPDATE dresses SET stock_quantity = stock_quantity - ? WHERE id = ?";
      db.query(updateStockSql, [quantity, dress_id], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).send("Error updating stock");
          });
        }
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
};

exports.getAllOrders = (req, res) => {
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
};

exports.getOrderById = (req, res) => {
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
};

exports.updateOrder = (req, res) => {
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
};

exports.cancelOrder = (req, res) => {
  const { id } = req.params;
  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error starting transaction");
      return;
    }
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
      const updateStockSql =
        "UPDATE dresses SET stock_quantity = stock_quantity + ? WHERE id = ?";
      db.query(updateStockSql, [order.quantity, order.dress_id], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).send("Error updating stock");
          });
        }
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
};
