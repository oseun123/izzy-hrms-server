"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Grade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.User, {
        foreignKey: "grade_id",
        as: "users",
      });
    }
  }
  Grade.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Grade",
      tableName: "grades",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Grade;
};
