'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("symbols", {
      symbol: {
        type: Sequelize.STRING(20),
        allowNull: false,
        primaryKey: true
      },
      base: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      quote: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      stepSize: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      tickSize: {
        type: Sequelize.STRING(20),
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
        type: Sequelize.STRING(20),
        allowNull: false
      },
      minLotSize: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("symbols");
  }
};
