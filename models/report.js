'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // 一對一
      Report.belongsTo(models.User, { foreignKey: 'userId' })
      // 一對多
      Report.belongsTo(models.Stock, { foreignKey: 'stockId' })
    }
  }
  Report.init({
    title: DataTypes.STRING,
    from: DataTypes.STRING,
    report: DataTypes.TEXT,
    stock_id: DataTypes.INTEGER,
    publish_date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Report',
    tableName: 'Reports',
    underscored: true
  })
  return Report
}
