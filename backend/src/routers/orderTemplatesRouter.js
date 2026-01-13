import express from "express";
const router = express.Router();

import orderTemplatesController from "../controllers/orderTemplatesController.js";

router.get("/all/:symbol", orderTemplatesController.getAllOrderTemplates);

router.get("/:id", orderTemplatesController.getOrderTemplate);

router.get("/", orderTemplatesController.getOrderTemplates);

router.delete("/:id", orderTemplatesController.deleteOrderTemplate);

router.post("/", orderTemplatesController.insertOrderTemplate);

router.patch("/:id", orderTemplatesController.updateOrderTemplate);

export default router;
