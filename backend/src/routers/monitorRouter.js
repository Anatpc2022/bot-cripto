import express from "express";
const router = express.Router();

import monitorsController from "../controllers/monitorsController.js";

router.get("/:id", monitorsController.getMonitor);

router.get("/", monitorsController.getMonitors);

router.delete("/:id", monitorsController.deleteMonitor);

router.post("/:id/start", monitorsController.startMonitor);

router.post("/:id/stop", monitorsController.stopMonitor);

router.post("/", monitorsController.insertMonitor);

router.patch("/:id", monitorsController.updateMonitor);

export default router;
