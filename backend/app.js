const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const categoriesRoutes = require("./routes/categories");
const dressesRoutes = require("./routes/dresses");
const ordersRoutes = require("./routes/orders");

app.use("/categories", categoriesRoutes);
app.use("/dresses", dressesRoutes);
app.use("/orders", ordersRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
