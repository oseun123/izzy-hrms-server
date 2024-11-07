"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.hasMany(models.User, {
        foreignKey: "employeestatus_id",
        as: "users",
      });
    }
  }
  EmployeeStatus.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "EmployeeStatus",
      tableName: "employeestatuses",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return EmployeeStatus;
};
