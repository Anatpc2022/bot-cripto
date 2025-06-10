import Sequelize from "sequelize";
import database from "../db.js";

const symbolModel = database.define("symbol", {
    symbol: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    base: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quote: {
        type: Sequelize.STRING,
        allowNull: false
    },
    stepSize: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tickSize: {
        type: Sequelize.STRING,
        allowNull: false
    },
    basePrecision: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    quotePrecision: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    minNotional: {
        type: Sequelize.STRING,
        allowNull: false
    },
    minLotSize: {
        type: Sequelize.STRING,
        allowNull: false
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
})

export default symbolModel;