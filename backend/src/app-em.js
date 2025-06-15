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

function startUserDataMonitor(userId){
    try{
        //carregar saldos da carteira

        //configurar stream de user data

        logger("U-" + userId, "O Monitor de Dados do Usuário foi iniciado!");
    }
    catch(err){
        logger("U-" + userId, "O Monitor de Dados do Usuário NÃO foi iniciado!\n" + (err.response ? JSON.stringify(err.response.data) : err.message));
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
