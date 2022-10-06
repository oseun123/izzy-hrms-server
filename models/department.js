"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.User, {
        foreignKey: "department_id",
        as: "users",
      });
    }
  }
  Department.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Department",
      tableName: "departments",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Department;
};
