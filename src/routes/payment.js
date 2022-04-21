const express = require("express");
const router = express.Router();

const paymentController = require("../app/controllers/paymentController");

//newsController.index
router.put("/:id",paymentController.update)
router.get("/buy", paymentController.buyCart);
router.get("/trashbuy", paymentController.trashbuy);
router.get("/buynows/:id", paymentController.buynows);
router.post("/add", paymentController.buyAdd);
router.post("/buynow", paymentController.buynow);
router.delete("/cancel-order/:id", paymentController.cancel_order);
router.delete("/cancel/:id/force",paymentController.force_order);
router.get("/:id/edit",paymentController.edit)
router.get("/orderCart", paymentController.orderCart);
router.patch("/:id/restore",paymentController.restore)

module.exports = router;
