const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");

router.post("/", ordersController.createOrder);
router.get("/", ordersController.getAllOrders);
router.get("/:id", ordersController.getOrderById);
router.put("/:id", ordersController.updateOrder);
router.put("/:id/cancel", ordersController.cancelOrder);

module.exports = router;
