import RiberBot from "./riberBot.js";
import Exchange from "./utils/exchange.js";
import logger from "./utils/logger.js";

let WSS;

function startTickerMonitor() {
  new Exchange().tickerStream(async (markets) => {
    const riberBot = RiberBot.getInstance();
    let results = await Promise.all(
      markets.map((mkt) =>
        riberBot.updateMemory(mkt.symbol, "TICKER", null, mkt)
      )
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
    Object.keys(info).map((item) =>
      riberBot.updateMemory(
        item,
        `WALLET_${userId}`,
        null,
        info[item].available,
        executeAutomations
      )
    )
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

function startUserDataMonitor(userId) {
  try {
    loadWallet(userId, false).catch((err) =>
      logger(
        "U-" + userId,
        "A carteira NÃO foi carregada!\n" +
          (err.body ? JSON.stringify(err.body) : err.message)
      )
    );

    //configurar stream de user data

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
