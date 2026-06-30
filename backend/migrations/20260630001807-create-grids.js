"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("grids", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      automationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "automations",
          key: "id",
        },
      },
      side: {
        type: Sequelize.STRING(4),
        allowNull: false,
        defaultValue: "BUY",
      },
      condition: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("grids");
  },
};
