"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Role, {
        through: "roleusers",
        as: "roles",
        foreignKey: "user_id",
      });
      this.hasMany(models.AuditLog, {
        as: "auditlogs",
        foreignKey: "user_id",
      });
    }
  }
  User.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
      // underscored: true,
    }
  );
  return User;
};
