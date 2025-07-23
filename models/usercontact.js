'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserContact extends Model {
    static associate(models) {
      // The contact belongs to a user (owner of the contact)
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });

      // The contact was created by a user (creator)
      this.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator',
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
      house_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      street_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      land_mark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lga: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
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
