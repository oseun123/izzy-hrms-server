/**
 * @module StepValidation
 * @description Middleware functions for validating step-related operations, including creation, deletion, and updating of steps.
 *
 * @requires ../../models
 * @requires ../../utils/helper
 */

const { Step, User } = require("../../models");
const { returnError, logError } = require("../../utils/helper");

/**
 * Validates the step creation request.
 *
 * @async
 * @function validateStep
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.name - The name of the step to be validated.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express `next` function to pass control to the next middleware.
 * @returns {void} Sends an error response if validation fails; otherwise, proceeds to the next middleware.
 */
async function validateStep(req, res, next) {
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
      const is_name = await Step.findOne({ where: { name } });
      if (is_name) {
        const message = "Step already exists.";
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
 * Validates the request to delete a step.
 *
 * @async
 * @function validateDeleteStep
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {number} req.params.id - The ID of the step to be deleted.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express `next` function to pass control to the next middleware.
 * @returns {void} Sends an error response if validation fails; otherwise, proceeds to the next middleware.
 */
async function validateDeleteStep(req, res, next) {
  try {
    const step = req.params.id;
    const sys_step = await Step.findOne({
      where: { id: step },
      include: [
        {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    if (sys_step.dataValues.users.length) {
      const message = "Cannot delete step with users associated with it.";
      logError(req, message, req.decoded.id);

      const returnObj = {
        status: "error",
        message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }
    req.step = sys_step;
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
 * Validates the request to update a step.
 *
 * @async
 * @function validateUpdateStep
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {number} req.params.id - The ID of the step to be updated.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express `next` function to pass control to the next middleware.
 * @returns {void} Sends an error response if validation fails; otherwise, proceeds to the next middleware.
 */
async function validateUpdateStep(req, res, next) {
  try {
    const step = req.params.id;
    const sys_step = await Step.findOne({
      where: { id: step },
    });

    if (sys_step) {
      req.sys_step = sys_step;
      next();
    } else {
      const message = "Invalid step selection.";
      logError(req, message, req.decoded.id);
      return returnError({
        status: "error",
        message: message,
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
  validateStep,
  validateDeleteStep,
  validateUpdateStep,
};
