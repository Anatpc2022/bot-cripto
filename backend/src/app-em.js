import RiberBot from "./riberBot.js";
import Exchange from "./utils/exchange.js";
import logger from "./utils/logger.js";

let WSS;

function startTickerMonitor() {
  new Exchange().tickerStream(async (markets) => {
    const riberBot = RiberBot.getInstance();
    let results = await Promise.all(markets.map((mkt) =>
      riberBot.updateMemory(mkt.symbol, "TICKER", null, mkt)
    ));
    if (!results) return;

    results = results.filter(r => r);
        if (results.length)
            results.map(r => WSS.broadcast({ notification: r }));//{ text, type: success|error }
  });
  logger("M-TICKER", "Ticker Monitor foi iniciado!");
}

async function init(userId, wssInstance) {
  WSS = wssInstance;

  startTickerMonitor();

  //monitoramento da conta do usuário

  //monitoramento de ativos (candles)

  logger("sistema", "O App Exchange Monitor foi iniciado!");
}

export default {
  init,
};
