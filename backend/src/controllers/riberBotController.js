import RiberBot from "../riberBot.js";
import indexes from "../utils/indexes.js";
import monitorsRepository from "../repositories/monitorsRepository.js";
import automationsRepository from "../repositories/automationsRepository.js";
import riberBotAi from "../riberBot-ai.js";
import path from "path";
import fs from "fs";

async function getMemoryIndexes(req, res) {
  const userId = res.locals.token.id;
  let monitors = await monitorsRepository.getActiveUserMonitors(userId);
  let userIndexes = [];
  if (monitors && monitors.length) {
    monitors = monitors.filter(
      (m) => m.type === monitorsRepository.monitorTypes.CANDLES,
    );
    userIndexes = monitors
      .filter((m) => m.indexes)
      .map((m) =>
        m.indexes
          .split(",")
          .filter((ix) => ix)
          .map((ix) => ix + "_" + m.interval),
      )
      .flat();
    userIndexes.push(
      ...monitors.map((m) => `${indexes.indexKeys.LAST_CANDLE}_${m.interval}`),
    );
    userIndexes.push(
      ...monitors.map(
        (m) => `${indexes.indexKeys.PREVIOUS_CANDLE}_${m.interval}`,
      ),
    );
  }

  userIndexes.push(
    indexes.indexKeys.TICKER,
    `${indexes.indexKeys.WALLET}_${userId}`,
    `${indexes.indexKeys.LAST_ORDER}_${userId}`,
  );

  const automations = await automationsRepository.getActiveAutomations(userId);
  if (automations && automations.length)
    automations.map((a) =>
      userIndexes.push(`${indexes.indexKeys.AUTO_ORDER}_${a.id}`),
    );

  let memory = await RiberBot.getInstance().getMemoryIndexes();
  memory = userIndexes
    .map((uix) =>
      memory.filter((m) => new RegExp(`^(${uix}(\.|$))`).test(m.variable)),
    )
    .flat();

  memory = memory.sort((a, b) => {
    return a.variable > b.variable ? 1 : -1;
  });

  res.json(memory);
}

async function getMemory(req, res) {
  const memory = await RiberBot.getInstance().getMemory();
  res.json(memory);
}

async function getBrain(req, res) {
  const brain = await RiberBot.getInstance().getBrain();
  res.json(brain);
}

async function getBrainIndexes(req, res) {
  const brainIndexes = await RiberBot.getInstance().getBrainIndexes();
  res.json(brainIndexes);
}

async function updateMemory(req, res) {
  const memoryKey = req.params.index;
  let [symbol, index] = memoryKey.split(":");

  const indexSplit = index.split("_");
  const interval =
    indexSplit.length > 1 ? indexSplit[indexSplit.length - 1] : undefined;
  const indexName = interval ? index.replace("_" + interval, "") : index;
  const value = req.body.data;

  let results = await RiberBot.getInstance().updateMemory(
    symbol,
    indexName,
    interval,
    value,
    true,
  );
  if (results && results.length) results = results.filter((r) => r);
  res.json(results);
}

function getAnalysisIndexes(req, res) {
  res.json(indexes.getAnalysisIndexes());
}

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function chat(req, res) {
  const token = req.headers["authorization"];
  const question = req.body.question;
  const files = req.files;

  const fileUrls = [];
  const folder = path.resolve(__dirname, "..", "..", "files");

  if (files && files.length) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const oldPath = path.join(folder, file.filename);
      const newPath = path.join(folder, file.originalname);
      fs.renameSync(oldPath, newPath);
      fileUrls.push(newPath);
    }
  }

  const answer = await riberBotAi.chat(question, token, fileUrls);
  res.json({ question, answer });
}

async function cleanChat(req, res) {
  const folder = path.resolve(__dirname, "..", "..", "files");
  for (const file of fs.readdirSync(folder)) {
    fs.unlinkSync(path.join(folder, file));
  }

  await riberBotAi.cleanChat();
  res.sendStatus(204);
}

export default {
  getMemory,
  getBrain,
  getBrainIndexes,
  updateMemory,
  getAnalysisIndexes,
  getMemoryIndexes,
  chat,
  cleanChat,
};
