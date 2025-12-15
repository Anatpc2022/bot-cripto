"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orderTemplates", {
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
      symbol: {
        type: Sequelize.STRING(20),
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
      limitPrice: Sequelize.STRING(20),
      limitPriceMultiplier: Sequelize.DECIMAL(6, 3),
      stopPrice: Sequelize.STRING(20),
      stopPriceMultiplier: Sequelize.DECIMAL(6, 3),
      trailingDelta: Sequelize.INTEGER,
      quantity: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      quantityMultiplier: Sequelize.DECIMAL(6, 3),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.addIndex(
      "orderTemplates",
      ["name", "symbol", "userId"],
      {
        name: "orderTemplates_symbol_name_userId_index",
        unique: true,
      }
    );

    await queryInterface.changeColumn("automations", "openTemplateId", {
      type: Sequelize.INTEGER,
      references: {
        model: "orderTemplates",
        key: "id",
      },
    });

    await queryInterface.changeColumn("automations", "closeTemplateId", {
      type: Sequelize.INTEGER,
      references: {
        model: "orderTemplates",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("automations", "openTemplateId", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.changeColumn("automations", "closeTemplateId", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.removeIndex(
      "orderTemplates",
      "orderTemplates_symbol_name_userId_index"
    );
    await queryInterface.dropTable("orderTemplates");
  },
};
