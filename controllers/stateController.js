const { State, User } = require("../models");
const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require("./../utils/helper");

const createState = async (req, res, next) => {
  var log_obj = {
    action: "create_state",
    module: "preferences",
    sub_module: "state",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };

  try {
    const { name } = req.body;
    const new_state = await State.create({ name });

    const message = "State created Successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify(new_state);

    logInfo(req, message, req.decoded.id, log_obj);
    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;

    logError(req, message, req.decoded.id);

    return returnError(returnObj);
  }
};

const getAllStates = async (req, res, next) => {
  var log_obj = {
    action: "get_state",
    module: "preferences",
    sub_module: "state",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
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
      res_obj.message = message;
      res_obj.payload = {
        states,
      };
      log_obj.database = false;
      logInfo(req, message, req.decoded.id, log_obj);

      return returnSuccess(res_obj);
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
        sizeAsNumber > 10 &&
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

      res_obj.message = message;
      res_obj.payload = {
        states,
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

const deleteState = async (req, res, next) => {
  var log_obj = {
    action: "delete_state",
    module: "preferences",
    sub_module: "state",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const state = await req.State.destroy();
    const message = "State deleted successfully.";

    res_obj.message = message;
    res_obj.payload = {
      State: state.id,
    };

    log_obj.payload = JSON.stringify(state);
    logInfo(req, message, req.decoded.id, log_obj);
    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    logError(req, message, req.decoded.id, log_obj);

    return returnError(res_obj);
  }
};

const updateState = async (req, res, next) => {
  var log_obj = {
    action: "update_state",
    module: "preferences",
    sub_module: "state",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;

    const sys_state = req.sys_state;
    sys_state.set({
      name,
    });
    const updated_state = await sys_state.save();

    const message = "State updated successfully";

    res_obj.message = message;
    log_obj.payload = JSON.stringify({
      from: sys_state,
      to: updated_state,
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
  createState,
  getAllStates,
  deleteState,
  updateState,
};
