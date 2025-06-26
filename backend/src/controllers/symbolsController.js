import symbolsRepository from "../repositories/symbolsRepository.js";
import Exchange from "../utils/exchange.js";

async function getSymbols(req, res) {
  const symbols = await symbolsRepository.getSymbols();
  res.json(symbols);
}

async function getSymbol(req, res) {
  const symbol = req.params.symbol;
  const symbolObject = await symbolsRepository.getSymbol(symbol);
  res.json(symbolObject);
}

async function syncSymbols() {
  const usetBlvt = process.env.BINANCE_BLVT === "true";
  const ignoredCoins = (process.env.IGNORED_COINS || "").split(",");

  const exchange = new Exchange();
  const data = await exchange.exchangeInfo();
  let symbols = data.symbols.map((item) => {
    if (
      !usetBlvt &&
      (item.baseAsset.endsWith("UP") || item.baseAsset.endsWith("DOWN"))
    )
      return false;
    if (
      ignoredCoins.includes(item.quoteAsset) ||
      ignoredCoins.includes(item.baseAsset)
    )
      return false;

    const notionalFilter = item.filters.find(
      (f) => f.filterType === "NOTIONAL"
    );
    const lotSizeFilter = item.filters.find((f) => f.filterType === "LOT_SIZE");
    const priceFilter = item.filters.find(
      (f) => f.filterType === "PRICE_FILTER"
    );

    return {
      symbol: item.symbol,
      basePrecision: item.baseAssetPrecision,
      quotePrecision: item.quoteAssetPrecision,
      base: item.baseAsset,
      quote: item.quoteAsset,
      minNotional: notionalFilter ? notionalFilter.minNotional : "1",
      minLotSize: lotSizeFilter ? lotSizeFilter.minQty : "1",
      stepSize: lotSizeFilter ? lotSizeFilter.stepSize : "1",
      tickSize: priceFilter ? priceFilter.tickSize : "1",
    };
  });

  symbols = symbols.filter((s) => s);

  await symbolsRepository.deleteAll();
  await symbolsRepository.bulkInsert(symbols);
}

export default {
  syncSymbols,
  getSymbols,
  getSymbol
};
