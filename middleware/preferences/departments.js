const validator = require("validator");
const { Department,User } = require("../../models");
const { returnError, logError } = require("../../utils/helper");

async function validateDepartment(req, res, next) {
  const { name } = req.body;

  if (name === "") {
    return res.status(400).send({
      status: "error",
      message: "Name is required",
      payload: {},
    });
  } else {
    try {
      const is_name = await Department.findOne({ where: { name } });
      if (is_name) {
        return res.status(400).send({
          status: "error",
          message: "Department name already exist.",
          payload: {},
        });
      }
    } catch (error) {
      return res.status(400).send({
        status: "error",
        message: error.message,
        payload: {},
      });
    }
  }

  next();
}

async function validateDeleteDepartment(req, res, next) {
  try {
    const department = req.params.id;
    const sys_department = await Department.findOne({
      where: { id: department },
      include: [
        {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    if (sys_department.dataValues.users.length) {
      const message = "Cannot delete department with users associated with it.";
      logError(req, message, req.decoded.id);

      const returnObj = {
        status: "error",
        message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }
    req.sys_department = sys_department;
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

async function validateUpdateDepartment(req, res, next) {
  try {
    const department = req.params.id;
    const sys_department = await Department.findOne({
      where: { id: department },
    });

    if (sys_department) {

      req.sys_department = sys_department;
      next();
     
    } else {
      const message = "Invalid department selection.";
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
  validateDepartment,
  validateDeleteDepartment,
  validateUpdateDepartment
};
