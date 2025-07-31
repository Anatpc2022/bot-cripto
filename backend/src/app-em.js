import RiberBot from "./riberBot.js";
import Exchange from "./utils/exchange.js";
import logger from "./utils/logger.js";
import symbolsRepository from "./repositories/symbolsRepository.js";
import ordersRepository from "./repositories/ordersRepository.js";
import monitorsRepository from "./repositories/monitorsRepository.js";

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

function scheduleOrderUpdate(order, userId) {
  setTimeout(async () => {
    try {
      const updatedOrder = await ordersRepository.updateOrderByOrderId(
        order.orderId,
        order
      );
      if (!updatedOrder) return;

      // Mapa de tradução de status
      const statusTranslate = {
        FILLED: "Concluída",
        CANCELED: "Cancelada",
        NEW: "Nova",
        PARTIALLY_FILLED: "Parcialmente concluída",
        REJECTED: "Rejeitada",
        EXPIRED: "Expirada",
      };

      const translatedStatus = statusTranslate[order.status] || order.status;

      const type = order.status.indexOf("FILLED") !== -1 ? "success" : "error";
      WSS.broadcast({
        notification: {
          text: `Ordem #${updatedOrder.id} foi atualizada como: ${translatedStatus}`,
          type,
        },
      });

      const riberBot = RiberBot.getInstance();
      riberBot.updateMemory(
        order.symbol,
        `LAST_ORDER_${userId}`,
        null,
        updatedOrder.get({ plain: true })
      );
    } catch (err) {
      logger("U-" + userId, err);
    }
  }, 3000);
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

  scheduleOrderUpdate(order, userId);
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

function startChartMonitor(monitor) {
  if (!monitor.symbol)
    throw new Error("Can't start a Chart Monitor without a symbol!");

  new Exchange(monitor.userId).chartStream(
    monitor.symbol,
    monitor.interval || "1m",
    async (ohlc) => {
      console.log(ohlc);
      //processar as velas recebidas
    }
  );
}

async function init(userId, wssInstance) {
  WSS = wssInstance;

  startTickerMonitor();

  startUserDataMonitor(userId);

  logger("sistema", "Carregando as últimas ordens de Spot...");
  const lastOrders = await ordersRepository.getLastFilledOrders(userId);
  const riberBot = RiberBot.getInstance();
  await Promise.all(
    lastOrders.map((order) =>
      riberBot.updateMemory(
        order.symbol,
        `LAST_ORDER_${userId}`,
        null,
        order.get({ plain: true }),
        false
      )
    )
  );

  const userMonitors = await monitorsRepository.getActiveUserMonitors(userId);
  userMonitors
    .filter((m) => m.type === monitorsRepository.monitorTypes.CANDLES)
    .map((monitor) => setTimeout(() => startChartMonitor(monitor), 250));

  logger("sistema", "O App Exchange Monitor foi iniciado!");
}

export default {
  init,
};
