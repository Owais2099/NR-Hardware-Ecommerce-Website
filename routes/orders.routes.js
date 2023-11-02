const express = require("express");

const ordersController = require("../controllers/orders.controller");

const router = express.Router();

router.post("/", ordersController.addOrder);

router.get("/", ordersController.getOrders);

router.get("/success", ordersController.getSuccess);

router.get("/failure", ordersController.getFailure);

module.exports = router;
