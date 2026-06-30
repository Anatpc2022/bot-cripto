import database from "../db.js";
import Sequelize from "sequelize";

const GridModel = database.define("grid", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  automationId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  side: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  condition: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

export default GridModel;
