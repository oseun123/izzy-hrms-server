'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserContact extends Model {
    static associate(models) {
      // Belongs to user (owner of contact info)
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });

      // Created by
      this.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator',
      });

      // Optional: associate with state and country models
      this.belongsTo(models.State, {
        foreignKey: 'state_id',
        as: 'state',
      });

      this.belongsTo(models.Country, {
        foreignKey: 'country_id',
        as: 'country',
      });
    }
  }

  UserContact.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      house_number: DataTypes.STRING,
      street_name: DataTypes.STRING,
      land_mark: DataTypes.STRING,
      lga: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      state_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_authorized: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'UserContact',
      tableName: 'usercontacts',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );

  return UserContact;
};
