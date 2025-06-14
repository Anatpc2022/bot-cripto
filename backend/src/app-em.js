import Exchange from "./utils/exchange.js";
import logger from "./utils/logger.js";

function startTickerMonitor() {
    new Exchange().tickerStream(async (markets) => {
        console.log(markets);
    })
    logger("M-TICKER", "Ticker Monitor foi iniciado!");
}

async function init(userId) {

    startTickerMonitor();

    //monitoramento da conta do usuário

    //monitoramento de ativos (candles)

    logger("sistema", "O App Exchange Monitor foi iniciado!");
}

export default {
    init
}