'use strict';

import symbolsController from '../src/controllers/symbolsController.js';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await symbolsController.syncSymbols();
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("symbols");
  }
};