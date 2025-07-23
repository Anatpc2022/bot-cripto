'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("monitors", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id"
        }
      },
      symbol: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      type: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      interval: Sequelize.STRING(4),
      indexes: Sequelize.STRING(1000),
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      logs: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })

    await queryInterface.addIndex("monitors", ["type", "symbol", "interval", "userId"], {
      name: "monitors_type_symbol_interval_userId_index",
      unique: true
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("monitors", "monitors_type_symbol_interval_userId_index");
    await queryInterface.dropTable("monitors");
  }
};