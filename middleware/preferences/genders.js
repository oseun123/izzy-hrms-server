const validator = require("validator");
const { Gender, User } = require("../../models");
const { returnError, logError } = require("../../utils/helper");

async function validateGender(req, res, next) {
  const { name } = req.body;

  if (name === "") {
    const returnObj = {
      status: "error",
      message: "Name is required",
      payload: {},
      res,
    };
    return returnError(returnObj);
  } else {
    try {
      const is_name = await Gender.findOne({ where: { name } });
      if (is_name) {
        const returnObj = {
          status: "error",
          message: "Gender already exist.",
          payload: {},
          res,
        };
        return returnError(returnObj);
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

  next();
}
async function validateDeleteGender(req, res, next) {
  try {
    const gender = req.params.id;
    const sys_gender = await Gender.findOne({
      where: { id: gender },
      include: [
        {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    if (sys_gender.dataValues.users.length) {
      const message = "Cannot delete gender with users associated with it.";
      logError(req, message, req.decoded.id);

      const returnObj = {
        status: "error",
        message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }
    req.gender = sys_gender;
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
async function validateUpdateGender(req, res, next) {
  try {
    const gender = req.params.id;
    const sys_gender = await Gender.findOne({
      where: { id: gender },
    });

    if (!sys_gender) {
      const message = "Invalid gender selection.";
      logError(req, message, req.decoded.id);
      return returnError({
        status: "error",
        message: message,
        payload: {},
        res,
      });
    } else {
      req.sys_gender = sys_gender;
    }
    next();
  } catch (error) {
    console.log("hhhh");
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
  validateGender,
  validateDeleteGender,
  validateUpdateGender,
};
