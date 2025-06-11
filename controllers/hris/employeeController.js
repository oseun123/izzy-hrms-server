/**
 * @module EmployeeController
 * @description Controller for managing employee-related operations such as creating, retrieving, deleting, and updating employee.
 *
 * @requires ../../models
 * @requires ../../utils/helper
 * @requires process.env
 */

const { User } = require('../../models');
const sendEmail = require('../../utils/sendEmail');
const { employeeSetupTemplate } = require('../../utils/template/authTemplate');
const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require('./../../utils/helper');

const { NODE_ENV, APP_NAME, APP_MAIL_FROM } = process.env;

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

const createEmployee = async (req, res, next) => {
  var log_obj = {
    action: 'create_employee',
    module: 'hris',
    sub_module: 'onboarding',
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: '', payload: {} };
  try {
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

    const new_employee = await User.create({
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
    });
    const message = 'Employee created Successfully';
    res_obj.message = message;
    log_obj.payload = JSON.stringify(new_employee);

    logInfo(req, message, req.decoded.id, log_obj);
    const sent = setupEmail(req, new_employee);
    if (sent) {
      returnSuccess(res_obj);
    } else {
      const message = 'Email failed';
      res_obj.message =
        NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
      logError(req, message, req.decoded.id, log_obj);

      returnError(res_obj);
    }
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
    logError(req, message, req.decoded.id, log_obj);

    returnError(res_obj);
  }
};

const setupEmail = async (req, user) => {
  const { protocol, hostname } = req;
  const port = NODE_ENV === 'development' ? ':3000' : '';
  const link = `${protocol}://${hostname}${port}/setup-password`;
  const emailBody = await employeeSetupTemplate(link, user);

  const sent = await sendEmail(
    user.email,
    `${APP_MAIL_FROM}`,
    `${APP_NAME} account setup`,
    emailBody,
  );

  return sent;
};

// /**
//  * Retrieves all grades, with optional pagination.
//  *
//  * @async
//  * @function getAllGrades
//  * @param {Object} req - Express request object.
//  * @param {Object} req.query - The query parameters.
//  * @param {string} [req.query.all] - If "all", retrieves all grades.
//  * @param {number} [req.query.page] - Page number for pagination.
//  * @param {number} [req.query.size] - Number of grades per page.
//  * @param {Object} res - Express response object.
//  * @param {Function} next - Express next middleware function.
//  * @returns {void} Sends a success response with the retrieved grades or an error response.
//  */
// const getAllGrades = async (req, res, next) => {
//   var log_obj = {
//     action: 'get_grade',
//     module: 'preferences',
//     sub_module: 'grade',
//     payload: null,
//     description: null,
//     database: true,
//   };

//   var res_obj = { res, message: '', payload: {} };

//   try {
//     const allgrades = req.query.all;

//     if (allgrades === 'all') {
//       const grades = await Grade.findAll({
//         include: [
//           {
//             model: User,
//             as: 'users',
//             attributes: { exclude: ['password'] },
//           },
//         ],
//       });

//       const message = 'Grade fetched successfully';
//       res_obj.message = message;
//       res_obj.payload = { grades };
//       log_obj.database = false;
//       logInfo(req, message, req.decoded.id, log_obj);

//       returnSuccess(res_obj);
//     } else {
//       const pageAsNumber = Number.parseInt(req.query.page);
//       const sizeAsNumber = Number.parseInt(req.query.size);

//       let page = 0;
//       if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
//         page = pageAsNumber - 1;
//       }

//       let size = 10;
//       if (
//         !Number.isNaN(sizeAsNumber) &&
//         sizeAsNumber > 10 &&
//         !(sizeAsNumber < 1)
//       ) {
//         size = sizeAsNumber;
//       }

//       const grades = await Grade.findAll({
//         include: [
//           {
//             model: User,
//             as: 'users',
//             attributes: { exclude: ['password'] },
//           },
//         ],
//         limit: size,
//         offset: page * size,
//       });
//       const total_count = await Grade.count();
//       const message = 'Grade fetched successfully';
//       res_obj.message = message;
//       res_obj.payload = {
//         grades,
//         total_count,
//         total_pages: Math.ceil(total_count / size),
//       };
//       log_obj.database = false;
//       logInfo(req, message, req.decoded.id, log_obj);

//       returnSuccess(res_obj);
//     }
//   } catch (error) {
//     const message = error.message;
//     res_obj.message =
//       NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
//     logError(req, message, req.decoded.id, log_obj);

//     returnError(res_obj);
//   }
// };

// /**
//  * Deletes a grade.
//  *
//  * @async
//  * @function deleteGrade
//  * @param {Object} req - Express request object.
//  * @param {Object} req.grade - The grade to delete, set by middleware.
//  * @param {Object} res - Express response object.
//  * @param {Function} next - Express next middleware function.
//  * @returns {void} Sends a success response or error response.
//  */
// const deleteGrade = async (req, res, next) => {
//   var log_obj = {
//     action: 'delete_grade',
//     module: 'preferences',
//     sub_module: 'grade',
//     payload: null,
//     description: null,
//     database: true,
//   };

//   var res_obj = { res, message: '', payload: {} };

//   try {
//     const grade = await req.grade.destroy();
//     const message = 'Grade deleted successfully.';

//     res_obj.message = message;
//     res_obj.payload = { grade: grade.id };

//     log_obj.payload = JSON.stringify(grade);

//     logInfo(req, message, req.decoded.id, log_obj);

//     returnSuccess(res_obj);
//   } catch (error) {
//     const message = error.message;
//     res_obj.message =
//       NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
//     logError(req, message, req.decoded.id, log_obj);

//     returnError(res_obj);
//   }
// };

// /**
//  * Updates an existing grade.
//  *
//  * @async
//  * @function updateGrade
//  * @param {Object} req - Express request object.
//  * @param {Object} req.body - The body of the request.
//  * @param {string} req.body.name - The updated name for the grade.
//  * @param {Object} req.sys_grade - The grade to update, set by middleware.
//  * @param {Object} res - Express response object.
//  * @param {Function} next - Express next middleware function.
//  * @returns {void} Sends a success response or error response.
//  */
// const updateGrade = async (req, res, next) => {
//   var log_obj = {
//     action: 'update_grade',
//     module: 'preferences',
//     sub_module: 'grade',
//     payload: null,
//     description: null,
//     database: true,
//   };

//   var res_obj = { res, message: '', payload: {} };
//   try {
//     const { name } = req.body;
//     const sys_grade = req.sys_grade;
//     sys_grade.set({ name });
//     const updated_grade = await sys_grade.save();

//     const message = 'Grade updated successfully';
//     res_obj.message = message;
//     log_obj.payload = JSON.stringify({
//       from: sys_grade,
//       to: updated_grade,
//     });

//     logInfo(req, message, req.decoded.id, log_obj);
//     returnSuccess(res_obj);
//   } catch (error) {
//     const message = error.message;
//     res_obj.message =
//       NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
//     logError(req, message, req.decoded.id, log_obj);
//     returnError(res_obj);
//   }
// };

module.exports = {
  createEmployee,
};
