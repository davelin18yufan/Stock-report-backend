'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // 一對多
      User.hasMany(models.Post, { foreignKey: 'userId' })
      User.hasMany(models.Report, { foreignKey: 'userId' })
      // 多對多
      User.belongsToMany(models.Post, {
        through: models.Favorite,
        foreignKey: 'userId',
        as: 'FavoritePost'
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
