import Sequelize from "sequelize";
import database from "../db.js";

const AutomationModel = database.define("automation", {
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
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "REGULAR",
  },
  symbol: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  openIndexes: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  openCondition: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  openTemplateId: Sequelize.INTEGER,
  closeIndexes: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  closeCondition: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  closeTemplateId: Sequelize.INTEGER,
  sendNotification: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isOpened: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  logs: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

export default AutomationModel;
