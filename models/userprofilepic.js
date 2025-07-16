'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProfilePic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  UserProfilePic.init(
    {
      user_id: DataTypes.INTEGER,
      image_url: DataTypes.STRING,
      status: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'UserProfilePic',
      tableName: 'userprofilepic',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );

  return UserProfilePic;
};
