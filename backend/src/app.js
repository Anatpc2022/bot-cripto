import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import errorMiddleware from "./middlewares/errorMiddleware.js";
import authMiddleware from "./middlewares/authMiddleware.js";

import authController from "./controllers/authController.js";
import exchangeController from "./controllers/exchangeController.js";

import riberBotRouter from "./routers/riberBotRouter.js";
import symbolsRouter from "./routers/symbolsRouter.js";
import ordersRouter from "./routers/ordersRouter.js";
import monitorsRouter from "./routers/monitorsRouter.js";
import automationsRouter from "./routers/automationsRouter.js";
import orderTemplatesRouter from "./routers/orderTemplatesRouter.js";

const app = express();

app.use(helmet());

app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json());

app.post("/login", authController.doLogin);

app.use("/exchange/balance", authMiddleware, exchangeController.getBalance);

app.post("/logout", authController.doLogout);

app.use("/riberBot", authMiddleware, riberBotRouter);

app.use("/symbols", authMiddleware, symbolsRouter);

app.use("/orders", authMiddleware, ordersRouter);

app.use("/monitors", authMiddleware, monitorsRouter);

app.use("/automations", authMiddleware, automationsRouter);

app.use("/ordertemplates", authMiddleware, orderTemplatesRouter);

app.use("/", (req, res, next) => {
  res.send("Hello World!");
});

app.use(errorMiddleware);

export default app;
