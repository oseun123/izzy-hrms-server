"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Step extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.User, {
        foreignKey: "step_id",
        as: "users",
      });
    }
  }
  Step.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "step",
      tableName: "steps",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Step;
};
