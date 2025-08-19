import Sequelize from "sequelize";
import database from "../db.js";
import AutomationModel from "./automationModel.js";
import MonitorModel from "./monitorModel.js";

const UserModel = database.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  telegramChat: Sequelize.STRING,
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

UserModel.hasMany(AutomationModel, {
  foreignKey: "userId",
});

UserModel.hasMany(MonitorModel, {
  foreignKey: "userId",
});

export default UserModel;
