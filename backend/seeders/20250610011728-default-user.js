'use strict';
import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs"

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    const userId = await queryInterface.rawSelect("users", {limit: 1}, ["id"])
    if(userId) return

    return queryInterface.bulkInsert("users", [{
      name: "RiberBot User",
      email: process.env.DEFAULT_USER_EMAIL,
      password: bcrypt.hashSync(process.env.DEFAULT_USER_PWD),
      telegramChat: process.env.DEFAULT_USER_TELEGRAM_CHAT,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users");
    
  }
};
