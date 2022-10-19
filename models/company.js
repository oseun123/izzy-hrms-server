"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Companay extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Branch, {
        foreignKey: "company_id",
        as: "branches",
      });
    }
  }
  Companay.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Company",
      tableName: "companys",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Companay;
};
