"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserSession.init(
    {
      user_id: DataTypes.INTEGER,
      refresh_token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserSession",
      tableName: "usersessions",
      createdAt: "created_at",
      updatedAt: "updated_at",
      // underscored: true,
    }
  );
  return UserSession;
};
