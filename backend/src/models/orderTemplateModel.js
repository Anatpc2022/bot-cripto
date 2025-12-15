import Sequelize from "sequelize";
import database from "../db.js";

const OrderTemplateModel = database.define("orderTemplate", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  symbol: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  side: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  limitPrice: Sequelize.STRING,
  limitPriceMultiplier: Sequelize.DECIMAL(6, 3),
  stopPrice: Sequelize.STRING,
  stopPriceMultiplier: Sequelize.DECIMAL(6, 3),
  trailingDelta: Sequelize.INTEGER,
  quantity: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  quantityMultiplier: Sequelize.DECIMAL(6, 3),
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

export default OrderTemplateModel;
