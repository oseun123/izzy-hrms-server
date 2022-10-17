const { State, User } = require("../models");
const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require("./../utils/helper");

const createState = async (req, res, next) => {
  try {
    const { name } = req.body;
    await State.create({ name });

    const message = "State created Successfully";
    const returnObj = {
      message,
      payload: {},
      res,
    };
    logInfo(req, message, req.decoded.id);
    return returnSuccess(returnObj);
  } catch (error) {
    const message = error.message;
    const returnObj = {
      message,
      payload: {},
      res,
    };
    logError(req, message, req.decoded.id);

    return returnError(returnObj);
  }
};

const getAllStates = async (req, res, next) => {
  try {
    const allStates = req.query.all;

    if (allStates === "all") {
      const states = await State.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      const message = " State fetched successfully";
      logInfo(req, message, req.decoded.id);
      const returnObj = {
        message,
        payload: {
          states,
        },
        res,
      };
      return returnSuccess(returnObj);
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
        !(sizeAsNumber > 10) &&
        !(sizeAsNumber < 1)
      ) {
        size = sizeAsNumber;
      }

      const states = await State.findAll({
        include: [
          {
            model: User,
            as: "users",
            attributes: { exclude: ["password"] },
          },
        ],
        // group: "State.id",
        limit: size,
        offset: page * size,
      });
      const total_count = await State.count();
      const message = " State fetched successfully";
      logInfo(req, message, req.decoded.id);
      const returnObj = {
        message,
        payload: {
          states,
          total_count,
          total_pages: Math.ceil(total_count / size),
        },
        res,
      };

      return returnSuccess(returnObj);
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    const returnObj = {
      message: message,
      payload: {},
      res,
    };
    return returnError(returnObj);
  }
};

const deleteState = async (req, res, next) => {
  try {
    const state = await req.State.destroy();
    const message = "State deleted successfully.";
    const returnObj = {
      res,
      message,
      payload: {
        State: state.id,
      },
    };
    return returnSuccess(returnObj);
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    const returnObj = {
      res,

      message: message,
      payload: {},
    };
    return returnError(returnObj);
  }
};

const updateState = async (req, res, next) => {
  try {
    const { name } = req.body;

    const sys_state = req.sys_state;
    sys_state.set({
      name,
    });
    await sys_state.save();

    const message = "State updated successfully";
    logInfo(req, message, req.decoded.id);

    return returnSuccess({
      message,
      payload: {},
      res,
    });
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    return returnError({
      message: message,
      payload: {},
      res,
    });
  }
};

module.exports = {
  createState,
  getAllStates,
  deleteState,
  updateState,
};
