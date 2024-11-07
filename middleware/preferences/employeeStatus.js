const validator = require("validator");
const { EmployeeStatus, User } = require("../../models");
const { returnError, logError } = require("../../utils/helper");

async function validateEmployeeStatus(req, res, next) {
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
      const is_name = await EmployeeStatus.findOne({ where: { name } });
      if (is_name) {
        const message = "Empolyee Status already exist.";
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
async function validateDeleteEmployeeStatus(req, res, next) {
  try {
    const employeeStatus = req.params.id;
    const sys_employeeStatus = await EmployeeStatus.findOne({
      where: { id: employeeStatus },
      include: [
        {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    if (sys_employeeStatus.dataValues.users.length) {
      const message =
        "Cannot delete Employee Status with users associated with it.";
      logError(req, message, req.decoded.id);

      const returnObj = {
        status: "error",
        message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }
    req.employeeStatus = sys_employeeStatus;
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
async function validateUpdateEmployeeStatus(req, res, next) {
  try {
    const employeeStatus = req.params.id;
    const sys_employeeStatus = await EmployeeStatus.findOne({
      where: { id: employeeStatus },
    });

    if (sys_employeeStatus) {
      req.sys_employeeStatus = sys_employeeStatus;
      next();
    } else {
      const message = "Invalid employee status selection.";
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
  validateEmployeeStatus,
  validateDeleteEmployeeStatus,
  validateUpdateEmployeeStatus,
};
