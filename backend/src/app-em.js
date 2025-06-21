import RiberBot from "./riberBot.js";
import Exchange from "./utils/exchange.js";
import logger from "./utils/logger.js";
import symbolsRepository from "./repositories/symbolsRepository.js";

let WSS;

const LOGS = process.env.APP_EM_LOGS === "true";

async function startTickerMonitor() {
  const symbolsMap = {};

  const symbolsArray = await symbolsRepository.getSymbols();
  symbolsArray.map((symbolObj) => (symbolsMap[symbolObj.symbol] = true));

  new Exchange().tickerStream(async (markets) => {
    const riberBot = RiberBot.getInstance();
    let results = await Promise.all(
      markets.map((mkt) => {
        if (!symbolsMap[mkt.symbol]) return false;
        return riberBot.updateMemory(mkt.symbol, "TICKER", null, mkt);
      })
    );
    if (!results) return;

    results = results.filter((r) => r);
    if (results.length) results.map((r) => WSS.broadcast({ notification: r })); //{ text, type: success|error }
  });
  logger("M-TICKER", "Ticker Monitor foi iniciado!");
}

async function loadWallet(userId, executeAutomations = true) {
  const exchange = new Exchange();

  const info = await exchange.balance();
  const riberBot = RiberBot.getInstance();
  let results = await Promise.all(
    Object.keys(info).map(async (item) => {
      if (executeAutomations) {
        const memory = await riberBot.getMemory(item, `WALLET_${userId}`);
        if (memory === info[item].available) return;
      }

      return riberBot.updateMemory(
        item,
        `WALLET_${userId}`,
        null,
        parseFloat(info[item].available),
        executeAutomations
      );
    })
  );

  const wallet = Object.keys(info).map((item) => {
    return {
      symbol: item,
      available: info[item].available,
      onOrder: info[item].onOrder,
    };
  });

  if (results) {
    results = results.filter((r) => r);
    if (results.length) results.map((r) => WSS.broadcast({ notification: r })); //{ text, type: success|error }
  }

  return wallet;
}

function processBalanceData(userId, data) {
  if (LOGS) logger("U-" + userId, JSON.stringify(data));

  loadWallet(userId, true).catch((err) =>
    logger("U-" + userId, err.body ? JSON.stringify(err.body) : err.message)
  );
}

async function processExecutionData(userId, data) {
  if (data.x === "NEW") return;

  if (LOGS) logger("U-" + userId, JSON.stringify(data));

  const order = {
    symbol: data.s,
    orderId: data.i,
    side: data.S,
    type: data.o,
    status: data.X,
    transactTime: data.T,
  };

  if (order.status === "FILLED") {
    const quoteAmount = parseFloat(data.Z);
    order.avgPrice = quoteAmount / parseFloat(data.z);
    order.commission = data.n;
    order.quantity = data.q;
    const isQuoteCommission = data.N && order.symbol.endsWith(data.N);
    order.net = isQuoteCommission
      ? quoteAmount - parseFloat(order.commission)
      : quoteAmount;
  } else if (order.status === "REJECTED") order.obs = data.r;

  //order update
}

function startUserDataMonitor(userId) {
  try {
    loadWallet(userId, false).catch((err) =>
      logger(
        "U-" + userId,
        "A carteira NÃO foi carregada!\n" +
          (err.body ? JSON.stringify(err.body) : err.message)
      )
    );

    const exchange = new Exchange(userId);
    exchange.userDataStream(
      (data) => processBalanceData(userId, data),
      (data) => processExecutionData(userId, data)
    );

    logger("U-" + userId, "O Monitor de Dados do Usuário foi iniciado!");
  } catch (err) {
    logger(
      "U-" + userId,
      "O Monitor de Dados do Usuário NÃO foi iniciado!\n" +
        (err.body ? JSON.stringify(err.body) : err.message)
    );
  }
}

async function init(userId, wssInstance) {
  WSS = wssInstance;

  startTickerMonitor();

  startUserDataMonitor(userId);

  //carregar últimas ordens executadas

  //monitoramento de ativos (candles)

  logger("sistema", "O App Exchange Monitor foi iniciado!");
}

export default {
  init,
};
