const validator = require("validator");
const { EmployeeCategory, User } = require("../../models");
const { returnError, logError } = require("../../utils/helper");

async function validateEmployeeCategory(req, res, next) {
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
      console.log({ EmployeeCategory, User });
      const is_name = await EmployeeCategory.findOne({ where: { name } });
      if (is_name) {
        const message = "Empolyee Category already exist.";
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
async function validateDeleteEmployeeCategory(req, res, next) {
  try {
    const employeeCategory = req.params.id;
    const sys_employeeCategory = await EmployeeCategory.findOne({
      where: { id: employeeCategory },
      include: [
        {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    if (sys_employeeCategory.dataValues.users.length) {
      const message =
        "Cannot delete Employee Category with users associated with it.";
      logError(req, message, req.decoded.id);

      const returnObj = {
        status: "error",
        message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }
    req.employeeCategory = sys_employeeCategory;
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
async function validateUpdateEmployeeCategory(req, res, next) {
  try {
    const employeeCategory = req.params.id;
    const sys_employeeCategory = await EmployeeCategory.findOne({
      where: { id: employeeCategory },
    });

    if (sys_employeeCategory) {
      req.sys_employeeCategory = sys_employeeCategory;
      next();
    } else {
      const message = "Invalid employee category selection.";
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
  validateEmployeeCategory,
  validateDeleteEmployeeCategory,
  validateUpdateEmployeeCategory,
};
