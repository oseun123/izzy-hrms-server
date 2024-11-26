/**
 * @module StepController
 * @description Controller for managing step-related operations such as creating, retrieving, deleting, and updating steps.
 *
 * @requires ../models
 * @requires ../utils/helper
 * @requires process.env
 */

const { Step, User } = require("../models");
const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require("./../utils/helper");

const { NODE_ENV } = process.env;

/**
 * Create a new step.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.name - The name of the step to create.
 * @param {Object} req.decoded - The decoded JWT payload containing user information.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const createStep = async (req, res, next) => {
  var log_obj = {
    action: "create_step",
    module: "preferences",
    sub_module: "step",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;
    const new_step = await Step.create({ name });
    const message = "Step created Successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify(new_step);

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
 * Retrieve all steps or a paginated list of steps.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters.
 * @param {string} [req.query.all] - If set to "all", fetch all steps.
 * @param {number} [req.query.page] - The page number for pagination.
 * @param {number} [req.query.size] - The number of items per page for pagination.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAllSteps = async (req, res, next) => {
  var log_obj = {
    action: "get_step",
    module: "preferences",
    sub_module: "step",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };

  try {
    const allsteps = req.query.all;

    if (allsteps === "all") {
      const steps = await Step.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      const message = "Steps fetched successfully";
      res_obj.message = message;
      res_obj.payload = { steps };
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
      if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0) {
        size = sizeAsNumber;
      }

      const steps = await Step.findAll({
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

      const total_count = await Step.count();
      const message = "Steps fetched successfully";
      res_obj.message = message;
      res_obj.payload = {
        steps,
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
 * Delete a step.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.step - The step instance to delete.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const deleteStep = async (req, res, next) => {
  var log_obj = {
    action: "delete_step",
    module: "preferences",
    sub_module: "step",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };

  try {
    const step = await req.step.destroy();
    const message = "Step deleted successfully.";

    res_obj.message = message;
    res_obj.payload = { step: step.id };

    log_obj.payload = JSON.stringify(step);

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
 * Update an existing step.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.name - The updated name for the step.
 * @param {Object} req.sys_step - The step instance to update.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const updateStep = async (req, res, next) => {
  var log_obj = {
    action: "update_step",
    module: "preferences",
    sub_module: "step",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;
    const sys_step = req.sys_step;
    sys_step.set({ name });
    const updated_step = await sys_step.save();

    const message = "Step updated successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify({
      from: sys_step,
      to: updated_step,
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
  createStep,
  getAllSteps,
  deleteStep,
  updateStep,
};
