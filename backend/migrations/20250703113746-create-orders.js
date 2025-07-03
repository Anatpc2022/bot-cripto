"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      automationId: Sequelize.INTEGER,
      symbol: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      orderId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      transactTime: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      side: {
        type: Sequelize.STRING(4),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      limitPrice: Sequelize.STRING(20),
      stopPrice: Sequelize.STRING(20),
      trailingDelta: Sequelize.INTEGER,
      avgPrice: Sequelize.DECIMAL(18, 8),
      commission: Sequelize.STRING,
      net: Sequelize.DECIMAL(18, 8),
      obs: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("orders");
  },
};
