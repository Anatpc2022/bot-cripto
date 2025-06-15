import { WebSocketServer } from "ws";
import WebSocket from "ws";
import logger from "./utils/logger.js";
import jwt from "jsonwebtoken";
import authController from "./controllers/authController.js";

function onMessage(data) {
  logger("sistema", `app-ws.onMessage: ${data}`);
}

function onError(err) {
  logger("sistema", `app-ws.onError: ${err.message}`);
}

function onConnection(ws, req) {
  ws.on("message", onMessage);
  ws.on("error", onError);
  logger("sistema", "app-ws.onConnection");
}

function broadcast(data) {
  if (!this.clients) return;
  this.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(data));
  });
}

const CORS_ORIGIN = process.env.CORS_ORIGIN;
function corsValidation(origin) {
  return CORS_ORIGIN === origin || CORS_ORIGIN === "*";
}

async function verifyClient(info, callback) {
  if (!corsValidation(info.origin)) return callback(false, 401);

  const token = info.req.url.split("token=")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const isBlacklisted = await authController.isBlacklisted(decoded);
      if (decoded && !isBlacklisted) return callback(true);
    } catch (err) {
      logger("system", err);
    }
  }

  return callback(false, 401);
}

export default function init(server) {
  const wss = new WebSocketServer({
    server,
    verifyClient,
  });
  wss.on("connection", onConnection);
  wss.broadcast = broadcast;
  logger("sistema", "O App Web Socket Server foi iniciado!");
  return wss;
}
