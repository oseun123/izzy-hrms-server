"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Company, {
        foreignKey: "company_id",
        as: "company",
      });

      this.belongsToMany(models.User, {
        through: "branchmanagers",
        as: "managers",
        foreignKey: "branch_id",
      });

      this.hasMany(models.User, {
        as: "users",
        foreignKey: "branch_id",
      });
    }
  }
  Branch.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      phone_1: DataTypes.STRING,
      phone_2: DataTypes.STRING,
      code: DataTypes.STRING,
      company_id: DataTypes.INTEGER,
      headquarters: DataTypes.BOOLEAN,
      // state_id: DataTypes.INTEGER,
      // country_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Branch",
      tableName: "branches",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Branch;
};
