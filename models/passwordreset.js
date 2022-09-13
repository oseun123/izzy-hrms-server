"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PasswordReset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PasswordReset.init(
    {
      user_id: DataTypes.INTEGER,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PasswordReset",
      tableName: "passwordresets",
      createdAt: "created_at",
      updatedAt: "updated_at",
      // underscored: true,
    }
  );
  return PasswordReset;
};
