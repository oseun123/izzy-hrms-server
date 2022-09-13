"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        as: "user",
        foreignKey: "user_id",
      });
    }
  }
  AuditLog.init(
    {
      user_id: DataTypes.INTEGER,
      ip: DataTypes.STRING,
      user_agent: DataTypes.STRING,
      message: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AuditLog",
      tableName: "auditlogs",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return AuditLog;
};
