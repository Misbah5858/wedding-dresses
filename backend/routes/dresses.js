const express = require("express");
const router = express.Router();
const dressesController = require("../controllers/dressesController");

router.get("/", dressesController.getAllDresses);
router.get("/:id", dressesController.getDressById);
router.post("/", dressesController.createDress);
router.put("/:id", dressesController.updateDress);
router.delete("/:id", dressesController.deleteDress);

module.exports = router;
