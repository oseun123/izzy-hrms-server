const { EmployeeCategory, User } = require("../models");
// const designation = require("../models/designation");

const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require("./../utils/helper");

const { NODE_ENV } = process.env;

const createEmployeeCategory = async (req, res, next) => {
  var log_obj = {
    action: "create_employee_category",
    module: "preferences",
    sub_module: "employee category",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;
    const new_employeeCategory = await EmployeeCategory.create({ name });
    const message = "Employee category created successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify(new_employeeCategory);

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

const getAllEmployeeCategories = async (req, res, next) => {
  var log_obj = {
    action: "get_employee_category",
    module: "preferences",
    sub_module: "employee category",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };

  try {
    const allemployeeCategory = req.query.all;

    if (allemployeeCategory === "all") {
      const employeeCategory = await EmployeeCategory.findAll({
        include: [
          {
            model: User,
            as: "users",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      const message = " Employee category fetched successfully";
      res_obj.message = message;
      res_obj.payload = {
        employeeCategory,
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

      const employeeCategory = await EmployeeCategory.findAll({
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
      const total_count = await EmployeeCategory.count();
      const message = " Employee category fetched successfully";
      res_obj.message = message;
      res_obj.payload = {
        employeeCategory,
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

const deleteEmployeeCategory = async (req, res, next) => {
  var log_obj = {
    action: "delete_employee_category",
    module: "preferences",
    sub_module: "employee category",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };

  try {
    const employeeCategory = await req.employeeCategory.destroy();
    const message = "Employee category deleted successfully.";

    res_obj.message = message;

    res_obj.payload = {
      employeeCategory: employeeCategory.id,
    };

    log_obj.payload = JSON.stringify(employeeCategory);

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

const updateEmployeeCategory = async (req, res, next) => {
  var log_obj = {
    action: "update_employee_category",
    module: "preferences",
    sub_module: "employee category",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;
    const sys_employeeCategory = req.sys_employeeCategory;
    sys_employeeCategory.set({
      name,
    });
    const updated_sys_employeeCategory = await sys_employeeCategory.save();

    const message = "Employee category updated successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify({
      from: sys_employeeCategory,
      to: updated_sys_employeeCategory,
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
  createEmployeeCategory,
  getAllEmployeeCategories,
  deleteEmployeeCategory,
  updateEmployeeCategory,
};
