"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("automations", {
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
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "REGULAR",
      },
      symbol: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      openIndexes: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      openCondition: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      openTemplateId: Sequelize.INTEGER,
      closeIndexes: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      closeCondition: {
        type: Sequelize.STRING(1000),
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

    await queryInterface.addIndex("automations", ["name", "symbol", "userId"], {
      name: "automations_symbol_name_userId_index",
      unique: true,
    });

    await queryInterface.addIndex("orders", ["symbol", "userId"], {
      name: "orders_symbol_userId_index",
    });

    await queryInterface.changeColumn("orders", "automationId", {
      type: Sequelize.INTEGER,
      references: {
        model: "automations",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("orders", "automationId", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.removeIndex("orders", "orders_symbol_userId_index");
    await queryInterface.removeIndex(
      "automations",
      "automations_symbol_name_userId_index"
    );
    await queryInterface.dropTable("automations");
  },
};
