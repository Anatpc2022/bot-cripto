import express from "express";
const router = express.Router();

import symbolsController from "../controllers/symbolsController.js";

router.get("/:symbol", symbolsController.getSymbol);

router.get("/", symbolsController.getSymbols);

export default router;