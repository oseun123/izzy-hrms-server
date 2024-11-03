const validator = require("validator");
const { Designation, User } = require("../../models");
const { returnError, logError } = require("../../utils/helper");

async function validateDesignation(req, res, next) {
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
      const is_name = await Designation.findOne({ where: { name } });
      if (is_name) {
        const message = "Designation already exist.";
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
async function validateDeleteDesignation(req, res, next) {
  try {
    const designation = req.params.id;
    const sys_designation = await Designation.findOne({
      where: { id: designation },
      include: [
        {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    if (sys_designation.dataValues.users.length) {
      const message =
        "Cannot delete designation with users associated with it.";
      logError(req, message, req.decoded.id);

      const returnObj = {
        status: "error",
        message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }
    req.designation = sys_designation;
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
async function validateUpdateDesignation(req, res, next) {
  try {
    const designation = req.params.id;
    const sys_designation = await Designation.findOne({
      where: { id: designation },
    });

    if (sys_designation) {
      req.sys_designation = sys_designation;
      next();
    } else {
      const message = "Invalid designation selection.";
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
  validateDesignation,
  validateDeleteDesignation,
  validateUpdateDesignation,
};
