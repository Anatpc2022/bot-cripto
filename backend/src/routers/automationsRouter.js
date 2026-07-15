import express from "express";
const router = express.Router();

import automationsController from "../controllers/automationsController.js";

router.get("/:id", automationsController.getAutomation);

router.get("/", automationsController.getAutomations);

router.delete("/:id", automationsController.deleteAutomation);

router.post("/grid", automationsController.insertGridAutomation);

router.post("/:id/start", automationsController.startAutomation);

router.post("/:id/stop", automationsController.stopAutomation);

router.post("/", automationsController.insertAutomation);

router.patch("/grid/:id", automationsController.updateGridAutomation);

router.patch("/:id", automationsController.updateAutomation);

export default router;
