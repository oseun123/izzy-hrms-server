"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeNumber extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmployeeNumber.init(
    {
      sequence: DataTypes.STRING,
      prefix: DataTypes.STRING,
      suffix: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "EmployeeNumber",
      tableName: "employeenumber",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return EmployeeNumber;
};
