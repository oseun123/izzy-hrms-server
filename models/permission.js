"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Role, {
        through: "permissionroles",
        as: "roles",
        foreignKey: "permission_id",
        onDelete: "cascade",
      });
    }
  }
  Permission.init(
    {
      name: DataTypes.STRING,
      for: DataTypes.STRING,
      menu: DataTypes.STRING,
      url: DataTypes.STRING,
      module: DataTypes.STRING,
      action: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Permission",
      tableName: "permissions",
      createdAt: "created_at",
      updatedAt: "updated_at",
      // underscored: true,
    }
  );
  return Permission;
};
