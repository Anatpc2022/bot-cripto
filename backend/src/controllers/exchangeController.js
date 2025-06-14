import RiberBot from "../riberBot.js";
import Exchange from "../utils/exchange.js";
import logger from "../utils/logger.js";

const FIAT = process.env.DEFAULT_FIAT;

async function getBalance(req, res, next) {
  const userId = res.locals.token.id;
  const exchange = new Exchange();
  const riberBot = RiberBot.getInstance();

  try {
    const info = await exchange.balance();
    let total = 0;
    const coins = Object.keys(info);

    await Promise.all(
      coins.map(async (coin) => {
        let partial =
          parseFloat(info[coin].available) + parseFloat(info[coin].onOrder);
        if (partial > 0)
          partial = await riberBot.tryFiatConversion(coin, partial, FIAT);
        info[coin].fiatEstimate = partial;
        total += partial;
      })
    );

    info.fiatEstimate = `~${FIAT} ${total.toFixed(2)}`;
    res.json(info);
  } 
  catch (err) {
    logger("U-" + userId, err.response ? err.response.data : err.message);
    res.status(500).send(err.response ? err.response.data : err.message);
  }
}

export default {
  getBalance,
};
