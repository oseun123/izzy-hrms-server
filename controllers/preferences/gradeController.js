/**
 * @module GradeController
 * @description Controller for managing grade-related operations such as creating, retrieving, deleting, and updating grades.
 *
 * @requires ../../models
 * @requires ../../utils/helper
 * @requires process.env
 */

const { Grade, User } = require("../../models");
const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require("./../../utils/helper");

const { NODE_ENV } = process.env;

/**
 * Creates a new grade.
 *
 * @async
 * @function createGrade
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.name - Name of the grade to create.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} Sends a success response or error response.
 */
const createGrade = async (req, res, next) => {
  var log_obj = {
    action: "create_grade",
    module: "preferences",
    sub_module: "grade",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;
    const new_grade = await Grade.create({ name });
    const message = "Grade created Successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify(new_grade);

    logInfo(req, message, req.decoded.id, log_obj);
    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    logError(req, message, req.decoded.id, log_obj);

    returnError(res_obj);
  }
};

/**
 * Retrieves all grades, with optional pagination.
 *
 * @async
 * @function getAllGrades
 * @param {Object} req - Express request object.
 * @param {Object} req.query - The query parameters.
 * @param {string} [req.query.all] - If "all", retrieves all grades.
 * @param {number} [req.query.page] - Page number for pagination.
 * @param {number} [req.query.size] - Number of grades per page.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} Sends a success response with the retrieved grades or an error response.
 */
const getAllGrades = async (req, res, next) => {
  var log_obj = {
    action: "get_grade",
    module: "preferences",
    sub_module: "grade",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };

  try {
    const allgrades = req.query.all;

    if (allgrades === "all") {
      const grades = await Grade.findAll({
        include: [
          {
            model: User,
            as: "users",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      const message = "Grade fetched successfully";
      res_obj.message = message;
      res_obj.payload = { grades };
      log_obj.database = false;
      logInfo(req, message, req.decoded.id, log_obj);

      returnSuccess(res_obj);
    } else {
      const pageAsNumber = Number.parseInt(req.query.page);
      const sizeAsNumber = Number.parseInt(req.query.size);

      let page = 0;
      if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber - 1;
      }

      let size = 10;
      if (
        !Number.isNaN(sizeAsNumber) &&
        sizeAsNumber > 10 &&
        !(sizeAsNumber < 1)
      ) {
        size = sizeAsNumber;
      }

      const grades = await Grade.findAll({
        include: [
          {
            model: User,
            as: "users",
            attributes: { exclude: ["password"] },
          },
        ],
        limit: size,
        offset: page * size,
      });
      const total_count = await Grade.count();
      const message = "Grade fetched successfully";
      res_obj.message = message;
      res_obj.payload = {
        grades,
        total_count,
        total_pages: Math.ceil(total_count / size),
      };
      log_obj.database = false;
      logInfo(req, message, req.decoded.id, log_obj);

      returnSuccess(res_obj);
    }
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    logError(req, message, req.decoded.id, log_obj);

    returnError(res_obj);
  }
};

/**
 * Deletes a grade.
 *
 * @async
 * @function deleteGrade
 * @param {Object} req - Express request object.
 * @param {Object} req.grade - The grade to delete, set by middleware.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} Sends a success response or error response.
 */
const deleteGrade = async (req, res, next) => {
  var log_obj = {
    action: "delete_grade",
    module: "preferences",
    sub_module: "grade",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };

  try {
    const grade = await req.grade.destroy();
    const message = "Grade deleted successfully.";

    res_obj.message = message;
    res_obj.payload = { grade: grade.id };

    log_obj.payload = JSON.stringify(grade);

    logInfo(req, message, req.decoded.id, log_obj);

    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    logError(req, message, req.decoded.id, log_obj);

    returnError(res_obj);
  }
};

/**
 * Updates an existing grade.
 *
 * @async
 * @function updateGrade
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.name - The updated name for the grade.
 * @param {Object} req.sys_grade - The grade to update, set by middleware.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} Sends a success response or error response.
 */
const updateGrade = async (req, res, next) => {
  var log_obj = {
    action: "update_grade",
    module: "preferences",
    sub_module: "grade",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;
    const sys_grade = req.sys_grade;
    sys_grade.set({ name });
    const updated_grade = await sys_grade.save();

    const message = "Grade updated successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify({
      from: sys_grade,
      to: updated_grade,
    });

    logInfo(req, message, req.decoded.id, log_obj);
    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    logError(req, message, req.decoded.id, log_obj);
    returnError(res_obj);
  }
};

module.exports = {
  createGrade,
  getAllGrades,
  deleteGrade,
  updateGrade,
};
