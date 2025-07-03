import Sequelize from "sequelize";
import database from "../db.js";

const OrderModel = database.define("order", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    automationId: Sequelize.INTEGER,
    symbol: {
        type: Sequelize.STRING,
        allowNull: false
    },
    orderId: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    transactTime: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    side: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantity: {
        type: Sequelize.STRING,
        allowNull: false
    },
    limitPrice: Sequelize.STRING,
    stopPrice: Sequelize.STRING,
    trailingDelta: Sequelize.INTEGER,
    avgPrice: Sequelize.DECIMAL(18, 8),
    commission: Sequelize.STRING,
    net: Sequelize.DECIMAL(18, 8),
    obs: Sequelize.STRING,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
})

export default OrderModel;