'use strict';
const { Model } = require('sequelize');
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
        through: 'roleusers',
        as: 'roles',
        foreignKey: 'user_id',
      });
      this.hasMany(models.AuditLog, {
        as: 'auditlogs_from',
        foreignKey: 'to_id',
      });
      this.hasMany(models.AuditLog, {
        as: 'auditlogs_to',
        foreignKey: 'to_id',
      });
      this.hasOne(models.Department, {
        as: 'headOfDepartment',
        foreignKey: 'hod',
      });

      this.belongsTo(models.Department, {
        foreignKey: 'department_id',
        as: 'department',
      });

      this.belongsTo(models.Gender, {
        foreignKey: 'gender_id',
        as: 'gender',
      });

      this.belongsTo(models.Designation, {
        foreignKey: 'designation_id',
        as: 'designation',
      });

      this.belongsTo(models.EmployeeCategory, {
        foreignKey: 'employeecategory_id',
        as: 'employeecategory',
      });
      this.belongsTo(models.EmployeeStatus, {
        foreignKey: 'employeestatus_id',
        as: 'employeestatus',
      });

      this.belongsTo(models.Country, {
        foreignKey: 'country_id',
        as: 'country',
      });

      this.belongsTo(models.State, {
        foreignKey: 'state_id',
        as: 'state',
      });

      this.belongsTo(models.Branch, {
        foreignKey: 'branch_id',
        as: 'user_branch',
      });
      this.belongsToMany(models.Branch, {
        through: 'branchmanagers',
        as: 'manager_branches',
        foreignKey: 'user_id',
        onDelete: 'cascade',
      });
      this.belongsTo(models.Grade, {
        foreignKey: 'grade_id',
        as: 'grade',
      });
      this.belongsTo(models.Step, {
        foreignKey: 'step_id',
        as: 'step',
      });
    }
  }
  User.init(
    {
      first_name: DataTypes.STRING,
      middle_name: DataTypes.STRING, // Add this
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      employee_number: DataTypes.STRING, // Add this
      employment_date: DataTypes.DATEONLY, // Add this
      department_id: DataTypes.INTEGER,
      grade_id: DataTypes.INTEGER,
      step_id: DataTypes.INTEGER,
      branch_id: DataTypes.INTEGER,
      company_id: DataTypes.INTEGER, // Add this
      designation_id: DataTypes.INTEGER,
      primary_supervisor: DataTypes.INTEGER, // Add this
      secondary_supervisor: DataTypes.INTEGER, // Add this
      employeestatus_id: DataTypes.INTEGER,
      employeecategory_id: DataTypes.INTEGER,
      country_id: DataTypes.INTEGER,
      state_id: DataTypes.INTEGER,
      gender_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      // underscored: true,
    },
  );
  return User;
};
