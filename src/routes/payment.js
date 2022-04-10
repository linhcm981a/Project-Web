const express = require("express");
const router = express.Router();

const paymentController = require("../app/controllers/paymentController");

//newsController.index
router.get("/add", paymentController.payment);

module.exports = router;
