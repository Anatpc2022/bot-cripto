import { WebSocketServer } from "ws";
import WebSocket from "ws";
import logger from "./utils/logger.js";

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
    this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN)
            client.send(JSON.stringify(data))
    })
}

export default function init(server) {
    const wss = new WebSocketServer({
        server
    });
    wss.on("connection", onConnection);
    wss.broadcast = broadcast;
    logger("sistema", "O App Web Socket Server foi iniciado!");
    return wss;
}