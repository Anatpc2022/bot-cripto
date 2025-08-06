import RiberBot from "./riberBot.js";
import Exchange from "./utils/exchange.js";
import logger from "./utils/logger.js";
import symbolsRepository from "./repositories/symbolsRepository.js";
import ordersRepository from "./repositories/ordersRepository.js";
import monitorsRepository from "./repositories/monitorsRepository.js";
import indexes from "./utils/indexes.js";

let WSS;
let exchange;

const LOGS = process.env.APP_EM_LOGS === "true";

async function startTickerMonitor() {
  const symbolsMap = {};

  const symbolsArray = await symbolsRepository.getSymbols();
  symbolsArray.map((symbolObj) => (symbolsMap[symbolObj.symbol] = true));

  exchange.tickerStream(async (markets) => {
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

async function processChartData(monitor, ohlc) {
  const monitorIndexes = monitor.indexes
    ? monitor.indexes.split(",").filter((ix) => ix)
    : [];
  if (monitorIndexes.length === 0) return false;

  const calculatedIndexes = {};
  let executeAutomations = false;

  monitorIndexes.forEach((index) => {
    const params = index.split("_"); //RSI_14
    const indexName = params[0];
    params.splice(0, 1);

    try {
      const calc = indexes.execCalc(indexName, ohlc, ...params);
      if (monitor.logs)
        logger(
          "M-" + monitor.id,
          `${index}_${monitor.interval} calculated: ${JSON.stringify(
            calc.current ? calc.current : calc
          )}`
        );

      calculatedIndexes[index] = calc;
      if (!executeAutomations) executeAutomations = !!calc.current;
    } catch (err) {
      logger(
        "M-" + monitor.id,
        `Exchange Monitor can't calc the index ${index}`
      );
      logger("M-" + monitor.id, err);
      return false;
    }
  });

  return RiberBot.getInstance().updateAllMemory(
    monitor.symbol,
    calculatedIndexes,
    monitor.interval,
    executeAutomations
  );
}

function startChartMonitor(monitor) {
  if (!monitor.symbol)
    throw new Error("Can't start a Chart Monitor without a symbol!");

  exchange.chartStream(
    monitor.symbol,
    monitor.interval || "1m",
    async (ohlc) => {
      const lastCandle = {
        open: ohlc.open[ohlc.open.length - 1],
        close: ohlc.close[ohlc.close.length - 1],
        high: ohlc.high[ohlc.high.length - 1],
        low: ohlc.low[ohlc.low.length - 1],
        volume: ohlc.volume[ohlc.volume.length - 1],
      };

      const previousCandle = {
        open: ohlc.open[ohlc.open.length - 2],
        close: ohlc.close[ohlc.close.length - 2],
        high: ohlc.high[ohlc.high.length - 2],
        low: ohlc.low[ohlc.low.length - 2],
        volume: ohlc.volume[ohlc.volume.length - 2],
      };

      const previousPreviousCandle = {
        open: ohlc.open[ohlc.open.length - 3],
        close: ohlc.close[ohlc.close.length - 3],
        high: ohlc.high[ohlc.high.length - 3],
        low: ohlc.low[ohlc.low.length - 3],
        volume: ohlc.volume[ohlc.volume.length - 3],
      };

      if (monitor.logs) logger("M-" + monitor.id, JSON.stringify(lastCandle));

      try {
        const riberBot = RiberBot.getInstance();
        let results = await riberBot.updateMemory(
          monitor.symbol,
          indexes.indexKeys.PREVIOUS_CANDLE,
          monitor.interval,
          {
            current: previousCandle,
            previous: previousPreviousCandle,
          }
        );
        if (results && results.length)
          results
            .filter((r) => r)
            .map((r) => WSS.broadcast({ notification: r }));

        results = await riberBot.updateMemory(
          monitor.symbol,
          indexes.indexKeys.LAST_CANDLE,
          monitor.interval,
          {
            current: lastCandle,
            previous: previousCandle,
          }
        );
        if (results && results.length)
          results
            .filter((r) => r)
            .map((r) => WSS.broadcast({ notification: r }));

        processChartData(monitor, ohlc);
      } catch (err) {
        logger("M-" + monitor.id, err);
      }
    }
  );
}

function stopChartMonitor(monitor) {
  if (!monitor.symbol)
    throw new Error("Can't stop a chart monitor without a symbol");
  exchange.terminateChartStream(monitor.symbol, monitor.interval);
  if (monitor.logs)
    logger(
      "M-" + monitor.id,
      `Chart monitor ${monitor.symbol}_${monitor.interval} stopped!`
    );

  const riberBot = RiberBot.getInstance();
  riberBot.deleteMemory(
    monitor.symbol,
    indexes.indexKeys.LAST_CANDLE,
    monitor.interval
  );
  riberBot.deleteMemory(
    monitor.symbol,
    indexes.indexKeys.PREVIOUS_CANDLE,
    monitor.interval
  );

  const indicators = monitor.indexes
    ? monitor.indexes.split(",").filter((ix) => ix)
    : [];
  indicators.map((ix) =>
    riberBot.deleteMemory(monitor.symbol, ix, monitor.interval)
  );
}

async function init(userId, wssInstance) {
  WSS = wssInstance;

  exchange = new Exchange(userId);

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
  startChartMonitor,
  stopChartMonitor,
};
