import symbolModel from "../models/symbolModel.js";

function deleteAll() {
  return symbolModel.destroy({ truncate: true });
}

function bulkInsert(symbols) {
  return symbolModel.bulkCreate(symbols);
}

function getSymbols() {
  return symbolModel.findAll();
}

function getSymbol(symbol) {
  return symbolModel.findOne({
    where: { symbol },
  });
}

export default {
  deleteAll,
  bulkInsert,
  getSymbols,
  getSymbol,
};
