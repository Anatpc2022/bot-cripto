import express from "express";
import multer from "multer";
const router = express.Router();

import riberBotController from "../controllers/riberBotController.js";

const uploadMiddleware = multer({ dest: "files" });
router.post(
  "/chat",
  uploadMiddleware.array("files[]"),
  riberBotController.chat,
);

router.delete("/chat", riberBotController.cleanChat);

router.get("/memory/indexes", riberBotController.getMemoryIndexes);

router.patch("/memory/:index", riberBotController.updateMemory);

router.get("/memory", riberBotController.getMemory);

router.get("/brain/indexes", riberBotController.getBrainIndexes);

router.get("/brain", riberBotController.getBrain);

router.get("/analysis", riberBotController.getAnalysisIndexes);

export default router;
