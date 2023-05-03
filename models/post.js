'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // 一對多
      Post.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Post.init({
    title: DataTypes.STRING,
    post: DataTypes.TEXT,
    image: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'Posts',
    underscored: true
  })
  return Post
}
