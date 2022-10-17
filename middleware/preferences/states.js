const validator = require("validator");
const { State, User } = require("../../models");
const { returnError, logError } = require("../../utils/helper");

async function validateState(req, res, next) {
  const { name } = req.body;

  if (name === "") {
    const returnObj = {
      message: "Name is required",
      payload: {},
      res,
    };
    return returnError(returnObj);
  } else {
    try {
      const is_name = await State.findOne({ where: { name } });
      if (is_name) {
        const returnObj = {
          message: "State already exist.",
          payload: {},
          res,
        };
        return returnError(returnObj);
      }
    } catch (error) {
      const returnObj = {
        message: error.message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }
  }

  next();
}
async function validateDeleteState(req, res, next) {
  try {
    const state = req.params.id;
    const sys_state = await State.findOne({
      where: { id: state },
      include: [
        {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    if (sys_state.dataValues.users.length) {
      const message = "Cannot delete state with users associated with it.";
      logError(req, message, req.decoded.id);

      const returnObj = {
        message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }
    req.State = sys_state;
  } catch (error) {
    const returnObj = {
      message: error.message,
      payload: {},
      res,
    };
    return returnError(returnObj);
  }
  next();
}
async function validateUpdateState(req, res, next) {
  try {
    const state = req.params.id;
    const sys_state = await State.findOne({
      where: { id: state },
    });

    if (sys_state) {
      req.sys_state = sys_state;
      next();
    } else {
      const message = "Invalid state selection.";
      logError(req, message, req.decoded.id);
      return returnError({
        message: message,
        payload: {},
        res,
      });
    }
  } catch (error) {
    const returnObj = {
      message: error.message,
      payload: {},
      res,
    };
    return returnError(returnObj);
  }
}

module.exports = {
  validateState,
  validateDeleteState,
  validateUpdateState,
};
