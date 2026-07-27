import technicalindicators from "technicalindicators";

function getAnalysisIndexes() {
  return {
    RSI: { params: "period", name: "RSI", code: "RSI", execution: RSI },
    SMA: { params: "period", name: "SMA", code: "SMA", execution: SMA },
    MACD: {
      params: "fast,slow,signal",
      name: "MACD",
      execution: MACD,
      code: "MACD",
    },
    EMA: { params: "period", name: "EMA", execution: EMA, code: "EMA" },
    "STOCH-RSI": {
      params: "d,k,rsi,stoch",
      name: "Stochastic RSI",
      execution: StochRSI,
      code: "STOCH-RSI",
    },
    "BOLLINGER-BANDS": {
      params: "period,stdDev",
      name: "Bollinger Bands",
      execution: bollingerBands,
      code: "BOLLINGER-BANDS",
    },
    ADL: { params: "", name: "ADL", execution: ADL, code: "ADL" },
    ADX: { params: "period", name: "ADX", execution: ADX, code: "ADX" },
    ATR: { params: "period", name: "ATR", execution: ATR, code: "ATR" },
    "AWESOME-OSCILLATOR": {
      params: "fast,slow",
      name: "Awesome Oscillator",
      execution: AO,
      code: "AWESOME-OSCILLATOR",
    },
    CCI: { params: "period", name: "CCI", execution: CCI, code: "CCI" },
    "FORCE-INDEX": {
      params: "period",
      name: "Force Index",
      execution: FI,
      code: "FORCE-INDEX",
    },
    KST: {
      params: "roc1,roc2,roc3,roc4,smaroc1,smaroc2,smaroc3,smaroc4,signal",
      name: "KST",
      execution: KST,
      code: "KST",
    },
    MFI: { params: "period", name: "MFI", execution: MFI, code: "MFI" },
    OBV: { params: "", name: "OBV", execution: OBV, code: "OBV" },
    PSAR: { params: "step,max", name: "PSAR", execution: PSAR, code: "PSAR" },
    ROC: { params: "period", name: "ROC", execution: ROC, code: "ROC" },
    STOCHASTIC: {
      params: "period,signal",
      name: "Stochastic",
      execution: Stochastic,
      code: "STOCHASTIC",
    },
    TRIX: { params: "period", name: "TRIX", execution: TRIX, code: "TRIX" },
    VWAP: { params: "", name: "VWAP", execution: VWAP, code: "VWAP" },
    "VOLUME-PROFILE": {
      params: "bars",
      name: "Volume Profile",
      execution: VP,
      code: "VOLUME-PROFILE",
    },
    WMA: { params: "period", name: "WMA", execution: WMA, code: "WMA" },
    WEMA: { params: "period", name: "WEMA", execution: WEMA, code: "WEMA" },
    "WILLIAMS-R": {
      params: "period",
      name: "Williams R",
      execution: williamsR,
      code: "WILLIAMS-R",
    },
    ICHIMOKU: {
      params: "conversion,base,span,displacement",
      name: "Ichimoku",
      execution: ichimoku,
      code: "ICHIMOKU",
    },
    "ABANDONED-BABY": {
      params: "",
      name: "Abandoned Baby",
      execution: abandonedBaby,
      code: "ABANDONED-BABY",
    },
    "BEAR-ENGULF": {
      params: "",
      name: "Bearish Engulfing",
      execution: bearishEngulfing,
      code: "BEAR-ENGULF",
    },
    "BULL-ENGULF": {
      params: "",
      name: "Bullish Engulfing",
      execution: bullishEngulfing,
      code: "BULL-ENGULF",
    },
    "DARK-CLOUD-COVER": {
      params: "",
      name: "Dark Cloud Cover",
      execution: darkCloudCover,
      code: "DARK-CLOUD-COVER",
    },
    "DOWNSIDE-TASUKI-GAP": {
      params: "",
      name: "Downside Tasuki Gap",
      execution: downsideTasukiGap,
      code: "DOWNSIDE-TASUKI-GAP",
    },
    DOJI: { params: "", name: "Doji", execution: doji, code: "DOJI" },
    "DRAGONFLY-DOJI": {
      params: "",
      name: "DragonFly Doji",
      execution: dragonflyDoji,
      code: "DRAGONFLY-DOJI",
    },
    "GRAVESTONE-DOJI": {
      params: "",
      name: "GraveStone Doji",
      execution: graveStoneDoji,
      code: "GRAVESTONE-DOJI",
    },
    "BEAR-HARAMI": {
      params: "",
      name: "Bearish Harami",
      execution: bearishHarami,
      code: "BEAR-HARAMI",
    },
    "BEAR-HARAMI-X": {
      params: "",
      name: "Bearish Harami Cross (X)",
      execution: bearishHaramiCross,
      code: "BEAR-HARAMI-X",
    },
    "BULL-HARAMI": {
      params: "",
      name: "Bullish Harami",
      execution: bullishHarami,
      code: "BULL-HARAMI",
    },
    "BULL-HARAMI-X": {
      params: "",
      name: "Bullish Harami Cross (X)",
      execution: bullishHaramiCross,
      code: "BULL-HARAMI-X",
    },
    "BULL-MARUBOZU": {
      params: "",
      name: "Bullish Marubozu",
      execution: bullishMarubozu,
      code: "BULL-MARUBOZU",
    },
    "BEAR-MARUBOZU": {
      params: "",
      name: "Bearish Marubozu",
      execution: bearishMarubozu,
      code: "BEAR-MARUBOZU",
    },
    "EVENING-DOJI-STAR": {
      params: "",
      name: "Evening Doji Star",
      execution: eveningDojiStar,
      code: "EVENING-DOJI-STAR",
    },
    "EVENING-STAR": {
      params: "",
      name: "Evening Star",
      execution: eveningStar,
      code: "EVENING-STAR",
    },
    "PIERCE-LINE": {
      params: "",
      name: "Piercing Line",
      execution: piercingLine,
      code: "PIERCE-LINE",
    },
    "BULL-SPIN-TOP": {
      params: "",
      name: "Bullish Spinning Top",
      execution: bullishSpinningTop,
      code: "BULL-SPIN-TOP",
    },
    "BEAR-SPIN-TOP": {
      params: "",
      name: "Bearish Spinning Top",
      execution: bearishSpinningTop,
      code: "BEAR-SPIN-TOP",
    },
    "MORNING-DOJI-STAR": {
      params: "",
      name: "Morning Doji Star",
      execution: morningDojiStar,
      code: "MORNING-DOJI-STAR",
    },
    "MORNING-STAR": {
      params: "",
      name: "Morning Star",
      execution: morningStar,
      code: "MORNING-STAR",
    },
    "3BLACK-CROWS": {
      params: "",
      name: "3 Black Crows",
      execution: threeBlackCrows,
      code: "3BLACK-CROWS",
    },
    "3WHITE-SOLDIERS": {
      params: "",
      name: "3 White Soldiers",
      execution: threeWhiteSoldiers,
      code: "3WHITE-SOLDIERS",
    },
    "BULL-HAMMER": {
      params: "",
      name: "Bullish Hammer",
      execution: bullishHammer,
      code: "BULL-HAMMER",
    },
    "BEAR-HAMMER": {
      params: "",
      name: "Bearish Hammer",
      execution: bearishHammer,
      code: "BEAR-HAMMER",
    },
    "BULL-INV-HAMMER": {
      params: "",
      name: "Bullish Inverted Hammer",
      execution: bullishInvertedHammer,
      code: "BULL-INV-HAMMER",
    },
    "BEAR-INV-HAMMER": {
      params: "",
      name: "Bearish Inverted Hammer",
      execution: bearishInvertedHammer,
      code: "BEAR-INV-HAMMER",
    },
    HAMMER: { params: "", name: "Hammer", execution: hammer, code: "HAMMER" },
    "HAMMER-UNCONF": {
      params: "",
      name: "Hammer (Unconf.)",
      execution: hammerUnconfirmed,
      code: "HAMMER-UNCONF",
    },
    "HANGING-MAN": {
      params: "",
      name: "Hanging Man",
      execution: hangingMan,
      code: "HANGMAN",
    },
    "HANGING-MAN-UNCONF": {
      params: "",
      name: "Hanging Man (Unconf.)",
      execution: hangingManUnconfirmed,
      code: "HANGING-MAN-UNCONF",
    },
    "SHOOT-STAR": {
      params: "",
      name: "Shooting Star",
      execution: shootingStar,
      code: "SHOOTSTAR",
    },
    "SHOOT-STAR-UNCONF": {
      params: "",
      name: "Shooting Star (Unconf.)",
      execution: shootingStarUnconfirmed,
      code: "SHOOT-STAR-UNCONF",
    },
    "TWEEZER-TOP": {
      params: "",
      name: "Tweezer Top",
      execution: tweezerTop,
      code: "TWEEZER-TOP",
    },
    "TWEEZER-BOTTOM": {
      params: "",
      name: "Tweezer Bottom",
      execution: tweezerBottom,
      code: "TWEEZER-BOTTOM",
    },
  };
}

function getCandles(ohlcv, qty) {
  const result = {
    open: [],
    high: [],
    low: [],
    close: [],
    volume: [],
  };

  let last = ohlcv.open.length - 1;
  let i = 0;
  while (i < qty) {
    result.open.push(ohlcv.open[last]);
    result.high.push(ohlcv.high[last]);
    result.low.push(ohlcv.low[last]);
    result.close.push(ohlcv.close[last]);
    result.volume.push(ohlcv.volume[last]);
    last--;
    i++;
  }

  return result;
}

function abandonedBaby(ohlc) {
  const input = getCandles(ohlc, 3);
  return technicalindicators.abandonedbaby(input);
}

function bullishEngulfing(ohlc) {
  const input = getCandles(ohlc, 2);
  return technicalindicators.bullishengulfingpattern(input);
}

function bearishEngulfing(ohlc) {
  const input = getCandles(ohlc, 2);
  return technicalindicators.bearishengulfingpattern(input);
}

function darkCloudCover(ohlc) {
  const input = getCandles(ohlc, 2);
  return technicalindicators.darkcloudcover(input);
}

function downsideTasukiGap(ohlc) {
  const input = getCandles(ohlc, 3);
  return technicalindicators.downsidetasukigap(input);
}

function doji(ohlc) {
  const input = getCandles(ohlc, 1);
  return technicalindicators.doji(input);
}

function dragonflyDoji(ohlc) {
  const input = getCandles(ohlc, 1);
  return technicalindicators.dragonflydoji(input);
}

function graveStoneDoji(ohlc) {
  const input = getCandles(ohlc, 1);
  return technicalindicators.gravestonedoji(input);
}

function bearishHarami(ohlc) {
  const input = getCandles(ohlc, 2);
  return technicalindicators.bearishharami(input);
}

function bullishHarami(ohlc) {
  const input = getCandles(ohlc, 2);
  return technicalindicators.bullishharami(input);
}

function bullishHaramiCross(ohlc) {
  const input = getCandles(ohlc, 2);
  return technicalindicators.bullishharamicross(input);
}

function bearishHaramiCross(ohlc) {
  const input = getCandles(ohlc, 2);
  return technicalindicators.bearishharamicross(input);
}

function bullishMarubozu(ohlc) {
  const input = getCandles(ohlc, 1);
  return technicalindicators.bullishmarubozu(input);
}

function bearishMarubozu(ohlc) {
  const input = getCandles(ohlc, 1);
  return technicalindicators.bearishmarubozu(input);
}

function eveningDojiStar(ohlc) {
  const input = getCandles(ohlc, 3);
  return technicalindicators.eveningdojistar(input);
}

function eveningStar(ohlc) {
  const input = getCandles(ohlc, 3);
  return technicalindicators.eveningstar(input);
}

function piercingLine(ohlc) {
  const input = getCandles(ohlc, 2);
  return technicalindicators.piercingline(input);
}

function bullishSpinningTop(ohlc) {
  const input = getCandles(ohlc, 1);
  return technicalindicators.bullishspinningtop(input);
}

function bearishSpinningTop(ohlc) {
  const input = getCandles(ohlc, 1);
  return technicalindicators.bearishspinningtop(input);
}

function morningDojiStar(ohlc) {
  const input = getCandles(ohlc, 3);
  return technicalindicators.morningdojistar(input);
}

function morningStar(ohlc) {
  const input = getCandles(ohlc, 3);
  return technicalindicators.morningstar(input);
}

function threeBlackCrows(ohlc) {
  const input = getCandles(ohlc, 3);
  return technicalindicators.threeblackcrows(input);
}

function threeWhiteSoldiers(ohlc) {
  const input = getCandles(ohlc, 3);
  return technicalindicators.threewhitesoldiers(input);
}

function bullishHammer(ohlc) {
  const input = getCandles(ohlc, 1);
  return technicalindicators.bullishhammerstick(input);
}

function bearishHammer(ohlc) {
  const input = getCandles(ohlc, 1);
  return technicalindicators.bearishhammerstick(input);
}

function bearishInvertedHammer(ohlc) {
  const input = getCandles(ohlc, 1);
  return technicalindicators.bearishinvertedhammerstick(input);
}

function bullishInvertedHammer(ohlc) {
  const input = getCandles(ohlc, 1);
  return technicalindicators.bullishinvertedhammerstick(input);
}

function hammer(ohlc) {
  const input = getCandles(ohlc, 5);
  return technicalindicators.hammerpattern(input);
}

function hammerUnconfirmed(ohlc) {
  const input = getCandles(ohlc, 5);
  return technicalindicators.hammerpatternunconfirmed(input);
}

function hangingMan(ohlc) {
  const input = getCandles(ohlc, 5);
  return technicalindicators.hangingman(input);
}

function hangingManUnconfirmed(ohlc) {
  const input = getCandles(ohlc, 5);
  return technicalindicators.hangingmanunconfirmed(input);
}

function shootingStar(ohlc) {
  const input = getCandles(ohlc, 5);
  return technicalindicators.shootingstar(input);
}

function shootingStarUnconfirmed(ohlc) {
  const input = getCandles(ohlc, 5);
  return technicalindicators.shootingstarunconfirmed(input);
}

function tweezerTop(ohlc) {
  const input = getCandles(ohlc, 5);
  return technicalindicators.tweezertop(input);
}

function tweezerBottom(ohlc) {
  const input = getCandles(ohlc, 5);
  return technicalindicators.tweezerbottom(input);
}

function ADL(ohlc) {
  const adlResult = technicalindicators.adl(ohlc);
  return {
    current: adlResult[adlResult.length - 1],
    previous: adlResult[adlResult.length - 2],
  };
}

function ADX(ohlc, period = 14) {
  period = parseInt(period);
  if (ohlc.high.length <= period) return { current: false, previous: false };

  const adxResult = technicalindicators.adx({
    high: ohlc.high,
    low: ohlc.low,
    close: ohlc.close,
    period,
  });
  return {
    current: adxResult[adxResult.length - 1],
    previous: adxResult[adxResult.length - 2],
  };
}

function ATR(ohlc, period = 14) {
  period = parseInt(period);
  if (ohlc.high.length <= period) return { current: false, previous: false };

  const atrResult = technicalindicators.atr({
    high: ohlc.high,
    low: ohlc.low,
    close: ohlc.close,
    period,
  });
  return {
    current: atrResult[atrResult.length - 1],
    previous: atrResult[atrResult.length - 2],
  };
}

function AO(ohlc, fastPeriod = 5, slowPeriod = 34) {
  fastPeriod = parseInt(fastPeriod);
  slowPeriod = parseInt(slowPeriod);

  if (ohlc.high.length <= fastPeriod || ohlc.high.length <= slowPeriod)
    return { current: false, previous: false };

  const aoResult = technicalindicators.awesomeoscillator({
    high: ohlc.high,
    low: ohlc.low,
    fastPeriod,
    slowPeriod,
  });
  return {
    current: aoResult[aoResult.length - 1],
    previous: aoResult[aoResult.length - 2],
  };
}

function CCI(ohlc, period = 20) {
  period = parseInt(period);
  if (ohlc.high.length <= period) return { current: false, previous: false };

  const cciResult = technicalindicators.cci({
    open: ohlc.open,
    high: ohlc.high,
    low: ohlc.low,
    close: ohlc.close,
    period,
  });
  return {
    current: cciResult[cciResult.length - 1],
    previous: cciResult[cciResult.length - 2],
  };
}

function FI(ohlc, period = 1) {
  period = parseInt(period);
  if (ohlc.high.length <= period) return { current: false, previous: false };

  const fiResult = technicalindicators.forceindex({
    open: ohlc.open,
    high: ohlc.high,
    low: ohlc.low,
    close: ohlc.close,
    volume: ohlc.volume,
    period,
  });
  return {
    current: fiResult[fiResult.length - 1],
    previous: fiResult[fiResult.length - 2],
  };
}

function KST(
  ohlc,
  ROCPer1 = 10,
  ROCPer2 = 15,
  ROCPer3 = 20,
  ROCPer4 = 30,
  SMAROCPer1 = 10,
  SMAROCPer2 = 10,
  SMAROCPer3 = 10,
  SMAROCPer4 = 15,
  signalPeriod = 3,
) {
  ROCPer1 = parseInt(ROCPer1);
  ROCPer2 = parseInt(ROCPer2);
  ROCPer3 = parseInt(ROCPer3);
  ROCPer4 = parseInt(ROCPer4);
  SMAROCPer1 = parseInt(SMAROCPer1);
  SMAROCPer2 = parseInt(SMAROCPer2);
  SMAROCPer3 = parseInt(SMAROCPer3);
  SMAROCPer4 = parseInt(SMAROCPer4);
  signalPeriod = parseInt(signalPeriod);

  if (
    [
      ROCPer1,
      ROCPer2,
      ROCPer3,
      ROCPer4,
      SMAROCPer1,
      SMAROCPer2,
      SMAROCPer3,
      SMAROCPer4,
      signalPeriod,
    ].some((p) => p >= ohlc.close.length)
  )
    return { current: false, previous: false };

  const kstResult = technicalindicators.kst({
    values: ohlc.close,
    ROCPer1,
    ROCPer2,
    ROCPer3,
    ROCPer4,
    SMAROCPer1,
    SMAROCPer2,
    SMAROCPer3,
    SMAROCPer4,
    signalPeriod,
  });
  return {
    current: kstResult[kstResult.length - 1],
    previous: kstResult[kstResult.length - 2],
  };
}

function MFI(ohlc, period = 14) {
  period = parseInt(period);
  if (ohlc.high.length <= period) return { current: false, previous: false };

  const mfiResult = technicalindicators.mfi({
    high: ohlc.high,
    low: ohlc.low,
    close: ohlc.close,
    volume: ohlc.volume,
    period,
  });
  return {
    current: mfiResult[mfiResult.length - 1],
    previous: mfiResult[mfiResult.length - 2],
  };
}

function OBV(ohlc) {
  const obvResult = technicalindicators.obv({
    close: ohlc.close,
    volume: ohlc.volume,
  });
  return {
    current: obvResult[obvResult.length - 1],
    previous: obvResult[obvResult.length - 2],
  };
}

function PSAR(ohlc, step, max) {
  const psarResult = technicalindicators.psar({
    high: ohlc.high,
    low: ohlc.low,
    step: parseFloat(step) || 0.02,
    max: parseFloat(max) || 0.2,
  });
  return {
    current: psarResult[psarResult.length - 1],
    previous: psarResult[psarResult.length - 2],
  };
}

function ROC(ohlc, period = 12) {
  period = parseInt(period);
  if (ohlc.close.length <= period) return { current: false, previous: false };

  const rocResult = technicalindicators.roc({
    period,
    values: ohlc.close,
  });
  return {
    current: rocResult[rocResult.length - 1],
    previous: rocResult[rocResult.length - 2],
  };
}

function Stochastic(ohlc, period = 14, signalPeriod = 3) {
  period = parseInt(period);
  signalPeriod = parseInt(signalPeriod);
  if (ohlc.high.length <= period || ohlc.high.length <= signalPeriod)
    return { current: false, previous: false };

  const stochResult = technicalindicators.stochastic({
    high: ohlc.high,
    low: ohlc.low,
    close: ohlc.close,
    period,
    signalPeriod,
  });
  return {
    current: stochResult[stochResult.length - 1],
    previous: stochResult[stochResult.length - 2],
  };
}

function TRIX(ohlc, period = 18) {
  period = parseInt(period);
  if (ohlc.close.length <= period) return { current: false, previous: false };

  const trixResult = technicalindicators.trix({
    period,
    values: ohlc.close,
  });
  return {
    current: trixResult[trixResult.length - 1],
    previous: trixResult[trixResult.length - 2],
  };
}

function VWAP(ohlc) {
  const vwapResult = technicalindicators.vwap(ohlc);
  return {
    current: vwapResult[vwapResult.length - 1],
    previous: vwapResult[vwapResult.length - 2],
  };
}

function VP(ohlc, noOfBars = 14) {
  noOfBars = parseInt(noOfBars);
  if (ohlc.high.length <= noOfBars) return { current: false, previous: false };

  const vpResult = technicalindicators.volumeprofile({
    open: ohlc.open,
    high: ohlc.high,
    low: ohlc.low,
    close: ohlc.close,
    volume: ohlc.volume,
    noOfBars,
  });
  return {
    current: vpResult[vpResult.length - 1],
    previous: vpResult[vpResult.length - 2],
  };
}

function williamsR(ohlc, period = 14) {
  period = parseInt(period);
  if (ohlc.high.length <= period) return { current: false, previous: false };

  const wrResult = technicalindicators.williamsr({
    open: ohlc.open,
    high: ohlc.high,
    low: ohlc.low,
    close: ohlc.close,
    period,
  });
  return {
    current: wrResult[wrResult.length - 1],
    previous: wrResult[wrResult.length - 2],
  };
}

function WMA(ohlc, period = 8) {
  period = parseInt(period);
  if (ohlc.close.length <= period) return { current: false, previous: false };

  const wmaResult = technicalindicators.wma({
    period,
    values: ohlc.close,
  });
  return {
    current: wmaResult[wmaResult.length - 1],
    previous: wmaResult[wmaResult.length - 2],
  };
}

function WEMA(ohlc, period = 5) {
  period = parseInt(period);
  if (ohlc.close.length <= period) return { current: false, previous: false };

  const wemaResult = technicalindicators.wema({
    period,
    values: ohlc.close,
  });
  return {
    current: wemaResult[wemaResult.length - 1],
    previous: wemaResult[wemaResult.length - 2],
  };
}

function MACD(ohlc, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  fastPeriod = parseInt(fastPeriod);
  slowPeriod = parseInt(slowPeriod);
  signalPeriod = parseInt(signalPeriod);

  if (
    [fastPeriod, slowPeriod, signalPeriod].some((p) => p >= ohlc.close.length)
  )
    return { current: false, previous: false };

  const macdResult = technicalindicators.macd({
    values: ohlc.close,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
    fastPeriod,
    slowPeriod,
    signalPeriod,
  });
  return {
    current: macdResult[macdResult.length - 1],
    previous: macdResult[macdResult.length - 2],
  };
}

function StochRSI(
  ohlc,
  dPeriod = 3,
  kPeriod = 3,
  rsiPeriod = 14,
  stochasticPeriod = 14,
) {
  dPeriod = parseInt(dPeriod);
  kPeriod = parseInt(kPeriod);
  rsiPeriod = parseInt(rsiPeriod);
  stochasticPeriod = parseInt(stochasticPeriod);

  if (
    [dPeriod, kPeriod, rsiPeriod, stochasticPeriod].some(
      (p) => p >= ohlc.close.length,
    )
  )
    return { current: false, previous: false };

  const stochResult = technicalindicators.stochasticrsi({
    dPeriod,
    kPeriod,
    rsiPeriod,
    stochasticPeriod,
    values: ohlc.close,
  });
  return {
    current: stochResult[stochResult.length - 1],
    previous: stochResult[stochResult.length - 2],
  };
}

function bollingerBands(ohlc, period = 20, stdDev = 2) {
  period = parseInt(period);
  stdDev = parseInt(stdDev);

  if (ohlc.close.length <= period) return { current: false, previous: false };

  const bbResult = technicalindicators.bollingerbands({
    period,
    stdDev,
    values: ohlc.close,
  });
  return {
    current: bbResult[bbResult.length - 1],
    previous: bbResult[bbResult.length - 2],
  };
}

function EMA(ohlc, period = 10) {
  period = parseInt(period);
  if (ohlc.close.length <= period) return { current: false, previous: false };

  const emaResult = technicalindicators.ema({
    values: ohlc.close,
    period,
  });
  return {
    current: emaResult[emaResult.length - 1],
    previous: emaResult[emaResult.length - 2],
  };
}

function SMA(ohlc, period = 10) {
  period = parseInt(period);
  if (ohlc.close.length <= period) return { current: false, previous: false };

  const result = technicalindicators.sma({
    values: ohlc.close,
    period,
  });

  return {
    current: parseFloat(result[result.length - 1]),
    previous: parseFloat(result[result.length - 2]),
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

function ichimoku(
  ohlc,
  conversionPeriod = 9,
  basePeriod = 26,
  spanPeriod = 52,
  displacement = 26,
) {
  conversionPeriod = parseInt(conversionPeriod);
  basePeriod = parseInt(basePeriod);
  spanPeriod = parseInt(spanPeriod);
  displacement = parseInt(displacement);

  if (
    [conversionPeriod, basePeriod, spanPeriod, displacement].some(
      (p) => p >= ohlc.high.length,
    )
  )
    return { current: false, previous: false };

  const ichimokuResult = technicalindicators.ichimokucloud({
    high: ohlc.high,
    low: ohlc.low,
    conversionPeriod,
    basePeriod,
    spanPeriod,
    displacement,
  });
  return {
    current: ichimokuResult[ichimokuResult.length - 1],
    previous: ichimokuResult[ichimokuResult.length - 2],
  };
}

function execCalc(indexName, ohlc, ...params) {
  return getAnalysisIndexes()[indexName].execution(ohlc, ...params);
}

export const indexKeys = {
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
