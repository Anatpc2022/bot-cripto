import express from "express";
const router = express.Router();

import symbolsController from "../controllers/symbolsController.js";

router.get("/", symbolsController.getSymbols);

export default router;