import RiberBot from "../riberBot.js";
import indexes from "../utils/indexes.js";
import monitorsRepository from "../repositories/monitorsRepository.js";
import automationsRepository from "../repositories/automationsRepository.js";

async function getMemoryIndexes(req, res) {
  const userId = res.locals.token.id;
  let monitors = await monitorsRepository.getActiveUserMonitors(userId);
  let userIndexes = [];
  if (monitors && monitors.length) {
    monitors = monitors.filter(
      (m) => m.type === monitorsRepository.monitorTypes.CANDLES
    );
    userIndexes = monitors
      .filter((m) => m.indexes)
      .map((m) =>
        m.indexes
          .split(",")
          .filter((ix) => ix)
          .map((ix) => ix + "_" + m.interval)
      )
      .flat();
    userIndexes.push(
      ...monitors.map((m) => `${indexes.indexKeys.LAST_CANDLE}_${m.interval}`)
    );
    userIndexes.push(
      ...monitors.map(
        (m) => `${indexes.indexKeys.PREVIOUS_CANDLE}_${m.interval}`
      )
    );
  }

  userIndexes.push(
    indexes.indexKeys.TICKER,
    `${indexes.indexKeys.WALLET}_${userId}`,
    `${indexes.indexKeys.LAST_ORDER}_${userId}`
  );

  const automations = await automationsRepository.getActiveAutomations(userId);
  if (automations && automations.length)
    automations.map((a) =>
      userIndexes.push(`${indexes.indexKeys.AUTO_ORDER}_${a.id}`)
    );

  let memory = await RiberBot.getInstance().getMemoryIndexes();
  memory = userIndexes
    .map((uix) =>
      memory.filter((m) => new RegExp(`^(${uix}(\.|$))`).test(m.variable))
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

  index = index.split("_")[0];
  const interval = index.split("_")[1];
  const value = req.body.data;

  let results = await RiberBot.getInstance().updateMemory(
    symbol,
    index,
    interval,
    value,
    true
  );
  if (results && results.length) results = results.filter((r) => r);
  res.json(results);
}

function getAnalysisIndexes(req, res) {
  res.json(indexes.getAnalysisIndexes());
}

export default {
  getMemory,
  getBrain,
  getBrainIndexes,
  updateMemory,
  getAnalysisIndexes,
  getMemoryIndexes,
};
