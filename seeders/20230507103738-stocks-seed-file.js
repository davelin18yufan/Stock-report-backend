'use strict'
const stocks = require('../stocksList_seed/stocks_seed')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const result = await stocks
    await queryInterface.bulkInsert('Stocks', result, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Stocks', {})
  }
}
