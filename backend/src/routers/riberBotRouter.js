import express from "express";
const router = express.Router();

import riberBotController from "../controllers/riberBotController.js";

router.get("/memory/indexes", riberBotController.getMemoryIndexes);

router.patch("/memory/:index", riberBotController.updateMemory);

router.get("/memory", riberBotController.getMemory);

router.get("/brain/indexes", riberBotController.getBrainIndexes);

router.get("/brain", riberBotController.getBrain);

router.get("/analysis", riberBotController.getAnalysisIndexes);

export default router;
