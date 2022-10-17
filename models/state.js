"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.User, {
        foreignKey: "state_id",
        as: "users",
      });
    }
  }
  State.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "State",
      tableName: "states",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return State;
};
