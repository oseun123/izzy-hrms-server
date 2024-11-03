const { Designation, User } = require("../models");
const designation = require("../models/designation");

const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require("./../utils/helper");

const { NODE_ENV } = process.env;

const createDesignation = async (req, res, next) => {
  var log_obj = {
    action: "create_designation",
    module: "preferences",
    sub_module: "designation",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;
    const new_designation = await Designation.create({ name });
    const message = "Designation created Successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify(new_designation);

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

const getAllDesignations = async (req, res, next) => {
  var log_obj = {
    action: "get_designation",
    module: "preferences",
    sub_module: "designation",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };

  try {
    const alldesignation = req.query.all;

    if (alldesignation === "all") {
      const designation = await Designation.findAll({
        include: [
          {
            model: User,
            as: "users",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      const message = " Designation fetched successfully";
      res_obj.message = message;
      res_obj.payload = {
        designation,
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

      const designations = await Designation.findAll({
        include: [
          {
            model: User,
            as: "users",
            attributes: { exclude: ["password"] },
          },
        ],
        // group: "Designation.id",
        limit: size,
        offset: page * size,
      });
      const total_count = await Designation.count();
      const message = " Designation fetched successfully";
      res_obj.message = message;
      res_obj.payload = {
        designations,
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

const deleteDesignation = async (req, res, next) => {
  var log_obj = {
    action: "delete_designation",
    module: "preferences",
    sub_module: "designation",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };

  try {
    const designation = await req.designation.destroy();
    const message = "Designation deleted successfully.";

    res_obj.message = message;

    res_obj.payload = {
      designation: designation.id,
    };

    log_obj.payload = JSON.stringify(designation);

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

const updateDesignation = async (req, res, next) => {
  var log_obj = {
    action: "update_designation",
    module: "preferences",
    sub_module: "designation",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;
    const sys_designation = req.sys_designation;
    sys_designation.set({
      name,
    });
    const updated_sys_designation = await sys_designation.save();

    const message = "Designation updated successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify({
      from: sys_designation,
      to: updated_sys_designation,
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
  createDesignation,
  getAllDesignations,
  deleteDesignation,
  updateDesignation,
};
