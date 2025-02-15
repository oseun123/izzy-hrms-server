const validator = require('validator');
const { User } = require('../../models');
const { returnError, logError } = require('../../utils/helper');

/**
 * Creates a new employee.
 *
 * @async
 * @function createEmployee
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.first_name - First name of the employee.
 * @param {string} req.body.middle_name - Middle name of the employee.
 * @param {string} req.body.last_name - Last name of the employee.
 * @param {string} req.body.employee_number - Unique employee number.
 * @param {string} req.body.employment_date - Date of employment (YYYY-MM-DD).
 * @param {number} req.body.department_id - ID of the department.
 * @param {number} req.body.grade_id - ID of the grade.
 * @param {number|null} req.body.step_id - ID of the step (nullable).
 * @param {number} req.body.branch_id - ID of the branch.
 * @param {number} req.body.company_id - ID of the company.
 * @param {number} req.body.designation_id - ID of the designation.
 * @param {number} req.body.primary_supervisor - ID of the primary supervisor.
 * @param {number} req.body.secondary_supervisor - ID of the secondary supervisor.
 * @param {number} req.body.employeestatus_id - ID of the employee status.
 * @param {number} req.body.employeecategory_id - ID of the employee category.
 * @param {string} req.body.email - Email of the employee.
 * @param {number} req.body.country_id - ID of the country.
 * @param {number} req.body.state_id - ID of the state.
 * @param {number} req.body.gender_id - ID of the gender.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} Sends a success response or error response.
 */

async function validateCreateEmployee(req, res, next) {
  const {
    first_name,
    middle_name,
    last_name,
    employee_number,
    employment_date,
    department_id,
    grade_id,
    step_id,
    branch_id,
    company_id,
    designation_id,
    primary_supervisor,
    secondary_supervisor,
    employeestatus_id,
    employeecategory_id,
    email,
    country_id,
    state_id,
    gender_id,
  } = req.body;

  if (first_name === '') {
    return returnError({
      message: 'First Name is required',
      payload: {},
      res,
    });
  }
  if (middle_name === '') {
    return returnError({
      message: 'Middle Name is required',
      payload: {},
      res,
    });
  }

  if (last_name === '') {
    return returnError({
      message: 'Last Name is required',
      payload: {},
      res,
    });
  }
  if (employee_number === '') {
    return returnError({
      message: 'Employee Number is required',
      payload: {},
      res,
    });
  }
  if (employment_date === '') {
    return returnError({
      message: 'Employment date is required',
      payload: {},
      res,
    });
  }

  if (department_id === '') {
    return returnError({
      message: 'Department is required',
      payload: {},
      res,
    });
  }

  if (grade_id === '') {
    return returnError({
      message: 'Employee grade is required',
      payload: {},
      res,
    });
  }
  if (step_id === '') {
    return returnError({
      message: 'Employee step is required',
      payload: {},
      res,
    });
  }
  if (company_id === '') {
    return returnError({
      message: 'Employee company is required',
      payload: {},
      res,
    });
  }
  if (branch_id === '') {
    return returnError({
      message: 'Employee branch is required',
      payload: {},
      res,
    });
  }
  if (designation_id === '') {
    return returnError({
      message: 'Designation is required',
      payload: {},
      res,
    });
  }
  if (primary_supervisor === '') {
    return returnError({
      message: 'Primary supervisor is required',
      payload: {},
      res,
    });
  }
  if (employeestatus_id === '') {
    return returnError({
      message: 'Employee status is required',
      payload: {},
      res,
    });
  }

  if (employeecategory_id === '') {
    return returnError({
      message: 'Employee category is required',
      payload: {},
      res,
    });
  }
  if (country_id === '') {
    return returnError({
      message: 'Country is required',
      payload: {},
      res,
    });
  }
  if (state_id === '') {
    return returnError({
      message: 'State is required',
      payload: {},
      res,
    });
  }
  if (gender_id === '') {
    return returnError({
      message: 'Gender is required',
      payload: {},
      res,
    });
  }
  if (email === '') {
    return returnError({
      message: 'Email is required',
      payload: {},
      res,
    });
  }
  if (!validator.isEmail(email)) {
    return returnError({
      message: 'Provide a valid email address',
      payload: {},
      res,
    });
  }

  next();
}

module.exports = {
  validateCreateEmployee,
};
