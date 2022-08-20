"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Permission, {
        through: "PermissionRoles",
        as: "permissions",
        foreignKey: "role_id",
        onDelete: "cascade",
      });
      this.belongsToMany(models.User, {
        through: "RoleUsers",
        as: "users",
        foreignKey: "role_id",
        onDelete: "cascade",
      });
    }
  }
  Role.init(
    {
      name: DataTypes.STRING,
      default: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Role",
      createdAt: "created_at",
      updatedAt: "updated_at",
      // underscored: true,
    }
  );
  return Role;
};
