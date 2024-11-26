/**
 * @module GradeValidation
 * @description Middleware functions for validating grade-related operations, including creation, deletion, and updating of grades.
 *
 * @requires ../../models
 * @requires ../../utils/helper
 */

const { Grade, User } = require("../../models");
const { returnError, logError } = require("../../utils/helper");

/**
 * @typedef {Object} Request
 * @property {Object} body - The body of the request.
 * @property {string} body.name - The name of the grade to be validated.
 * @property {Object} params - The route parameters.
 * @property {number} params.id - The ID of the grade for deletion or update.
 * @property {Object} decoded - Decoded JWT payload.
 * @property {string} decoded.id - The ID of the user making the request.
 */

/**
 * Validates the grade creation request.
 *
 * @async
 * @function validateGrade
 * @param {Request} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express `next` function to pass control to the next middleware.
 * @returns {void} Sends an error response if validation fails; otherwise, proceeds to the next middleware.
 */
async function validateGrade(req, res, next) {
  const { name } = req.body;

  if (name === "") {
    const message = "Name is required";
    const returnObj = {
      status: "error",
      message,
      payload: {},
      res,
    };
    logError(req, message, req.decoded.id);
    return returnError(returnObj);
  } else {
    try {
      const is_name = await Grade.findOne({ where: { name } });
      if (is_name) {
        const message = "Grade already exists.";
        const returnObj = {
          status: "error",
          message,
          payload: {},
          res,
        };
        logError(req, message, req.decoded.id);
        return returnError(returnObj);
      }
    } catch (error) {
      const message = error.message;
      const returnObj = {
        status: "error",
        message,
        payload: {},
        res,
      };
      logError(req, message, req.decoded.id);
      return returnError(returnObj);
    }
  }

  next();
}

/**
 * Validates the request to delete a grade.
 *
 * @async
 * @function validateDeleteGrade
 * @param {Request} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express `next` function to pass control to the next middleware.
 * @returns {void} Sends an error response if validation fails; otherwise, proceeds to the next middleware.
 */
async function validateDeleteGrade(req, res, next) {
  try {
    const gradeId = req.params.id;
    const sys_grade = await Grade.findOne({
      where: { id: gradeId },
      include: [
        {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    if (sys_grade.dataValues.users.length) {
      const message = "Cannot delete grade with users associated with it.";
      logError(req, message, req.decoded.id);

      const returnObj = {
        status: "error",
        message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }
    req.grade = sys_grade;
  } catch (error) {
    const returnObj = {
      status: "error",
      message: error.message,
      payload: {},
      res,
    };
    return returnError(returnObj);
  }
  next();
}

/**
 * Validates the request to update a grade.
 *
 * @async
 * @function validateUpdateGrade
 * @param {Request} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express `next` function to pass control to the next middleware.
 * @returns {void} Sends an error response if validation fails; otherwise, proceeds to the next middleware.
 */
async function validateUpdateGrade(req, res, next) {
  try {
    const gradeId = req.params.id;
    const sys_grade = await Grade.findOne({
      where: { id: gradeId },
    });

    if (sys_grade) {
      req.sys_grade = sys_grade;
      next();
    } else {
      const message = "Invalid grade selection.";
      logError(req, message, req.decoded.id);
      return returnError({
        status: "error",
        message,
        payload: {},
        res,
      });
    }
  } catch (error) {
    const returnObj = {
      status: "error",
      message: error.message,
      payload: {},
      res,
    };
    return returnError(returnObj);
  }
}

module.exports = {
  validateGrade,
  validateDeleteGrade,
  validateUpdateGrade,
};
