"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.User, {
        foreignKey: "employeecategory_id",
        as: "users",
      });
    }
  }
  EmployeeCategory.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "EmployeeCategory",
      tableName: "employeecategories",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return EmployeeCategory;
};
