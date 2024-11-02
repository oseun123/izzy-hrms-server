const { Gender, User } = require("../models");

const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require("./../utils/helper");

const { NODE_ENV } = process.env;

const createGender = async (req, res, next) => {
  var log_obj = {
    action: "create_gender",
    module: "preferences",
    sub_module: "gender",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;
    const new_gender = await Gender.create({ name });
    const message = "Gender created Successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify(new_gender);

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

const getAllGenders = async (req, res, next) => {
  var log_obj = {
    action: "get_gender",
    module: "preferences",
    sub_module: "gender",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };

  try {
    const allgenders = req.query.all;

    if (allgenders === "all") {
      const genders = await Gender.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      const message = " Gender fetched successfully";
      res_obj.message = message;
      res_obj.payload = {
        genders,
      };
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
      if (
        !Number.isNaN(sizeAsNumber) &&
        sizeAsNumber > 10 &&
        !(sizeAsNumber < 1)
      ) {
        size = sizeAsNumber;
      }

      const genders = await Gender.findAll({
        include: [
          {
            model: User,
            as: "users",
            attributes: { exclude: ["password"] },
          },
        ],
        // group: "Gender.id",
        limit: size,
        offset: page * size,
      });
      const total_count = await Gender.count();
      const message = " Gender fetched successfully";
      res_obj.message = message;
      res_obj.payload = {
        genders,
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

const deleteGender = async (req, res, next) => {
  var log_obj = {
    action: "delete_gender",
    module: "preferences",
    sub_module: "gender",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };

  try {
    const gender = await req.gender.destroy();
    const message = "Gender deleted successfully.";

    res_obj.message = message;

    res_obj.payload = {
      gender: gender.id,
    };

    log_obj.payload = JSON.stringify(gender);

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

const updateGender = async (req, res, next) => {
  var log_obj = {
    action: "update_gender",
    module: "preferences",
    sub_module: "gender",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;
    const sys_gender = req.sys_gender;
    sys_gender.set({
      name,
    });
    const updated_gender = await sys_gender.save();

    const message = "Gender updated successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify({
      from: sys_gender,
      to: updated_gender,
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
  createGender,
  getAllGenders,
  deleteGender,
  updateGender,
};
