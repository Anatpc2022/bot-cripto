import technicalindicators from "technicalindicators";

function getAnalysisIndexes() {
  return {
    RSI: { params: "period", name: "RSI", code: "RSI", execution: RSI },
  };
}

function RSI(ohlc, period = 14) {
  period = parseInt(period);
  if (ohlc.close.length <= period) return { current: false, previous: false };

  const result = technicalindicators.rsi({
    period,
    values: ohlc.close,
  });

  return {
    current: parseFloat(result[result.length - 1]),
    previous: parseFloat(result[result.length - 2]),
  };
}

function execCalc(indexName, ohlc, ...params) {
  return getAnalysisIndexes()[indexName].execution(ohlc, ...params);
}

const indexKeys = {
  WALLET: "WALLET",
  LAST_ORDER: "LAST_ORDER",
  PREVIOUS_CANDLE: "PREVIOUS_CANDLE",
  LAST_CANDLE: "LAST_CANDLE",
  TICKER: "TICKER",
  AUTO_ORDER: "AUTO_ORDER",
};

export default {
  indexKeys,
  execCalc,
  getAnalysisIndexes,
};
