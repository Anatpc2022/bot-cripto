import express from "express";
const router = express.Router();

import riberBotController from "../controllers/riberBotController.js";

router.patch("/memory/:index", riberBotController.updateMemory);

router.get("/memory", riberBotController.getMemory);

router.get("/brain", riberBotController.getBrain);

export default router;