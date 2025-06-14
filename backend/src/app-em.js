import RiberBot from "./riberBot.js";
import Exchange from "./utils/exchange.js";
import logger from "./utils/logger.js";

function startTickerMonitor() {
  new Exchange().tickerStream(async (markets) => {
    const riberBot = RiberBot.getInstance();
    markets.map((mkt) =>
      riberBot.updateMemory(mkt.symbol, "TICKER", null, mkt)
    );

    //notificar o usuário se disparou alguma automação
  });
  logger("M-TICKER", "Ticker Monitor foi iniciado!");
}

async function init(userId) {
  startTickerMonitor();

  //monitoramento da conta do usuário

  //monitoramento de ativos (candles)

  logger("sistema", "O App Exchange Monitor foi iniciado!");
}

export default {
  init,
};
