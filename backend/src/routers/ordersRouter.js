import express from "express";
const router = express.Router();

import ordersController from "../controllers/ordersController.js";

router.get("/reports/:quote", ordersController.getOrdersReport);

router.get("/:id", ordersController.getOrder);

router.get("/", ordersController.getOrders);

router.delete("/:symbol/:orderId", ordersController.cancelOrder);

router.post("/:id/sync", ordersController.syncOrder);

router.post("/", ordersController.placeOrder);

export default router;
