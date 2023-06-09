'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // 1對多
      Stock.hasMany(models.Report, { foreignKey: 'stockId' })
    }
  }
  Stock.init({
    name: DataTypes.STRING,
    symbol: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Stock',
    tableName: 'Stocks',
    underscored: true
  })
  return Stock
}
