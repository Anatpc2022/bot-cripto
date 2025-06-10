import symbolModel from "../models/symbolModel.js"

function deleteAll() {
    return symbolModel.destroy({ truncate: true });
}

function bulkInsert(symbols) {
    return symbolModel.bulkCreate(symbols);
}

export default {
    deleteAll,
    bulkInsert
}