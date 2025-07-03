import express from "express";
const router = express.Router();

import ordersController from "../controllers/ordersController.js";

router.get("/:id", ordersController.getOrder);

router.get("/", ordersController.getOrders);

router.post("/", ordersController.placeOrder);

export default router;