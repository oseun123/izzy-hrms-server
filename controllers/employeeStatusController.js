const { EmployeeStatus, User } = require("../models");
// const designation = require("../models/designation");

const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require("./../utils/helper");

const { NODE_ENV } = process.env;

const createEmployeeStatus = async (req, res, next) => {
  var log_obj = {
    action: "create_employee_status",
    module: "preferences",
    sub_module: "employee status",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;
    console.log({ name, EmployeeStatus });
    const new_employeeStatus = await EmployeeStatus.create({ name });
    const message = "Employee status created successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify(new_employeeStatus);

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

const getAllEmployeeStatuses = async (req, res, next) => {
  var log_obj = {
    action: "get_employee_status",
    module: "preferences",
    sub_module: "employee status",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };

  try {
    const allemployeeStatus = req.query.all;

    if (allemployeeStatus === "all") {
      const employeeStatus = await EmployeeStatus.findAll({
        include: [
          {
            model: User,
            as: "users",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      const message = " Employee status fetched successfully";
      res_obj.message = message;
      res_obj.payload = {
        employeeStatus,
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

      const employeeStatus = await EmployeeStatus.findAll({
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
      const total_count = await EmployeeStatus.count();
      const message = " Employee status fetched successfully";
      res_obj.message = message;
      res_obj.payload = {
        employeeStatus,
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

const deleteEmployeeStatus = async (req, res, next) => {
  var log_obj = {
    action: "delete_employee_status",
    module: "preferences",
    sub_module: "employee status",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };

  try {
    const employeeStatus = await req.employeeStatus.destroy();
    const message = "Employee status deleted successfully.";

    res_obj.message = message;

    res_obj.payload = {
      employeeStatus: employeeStatus.id,
    };

    log_obj.payload = JSON.stringify(employeeStatus);

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

const updateEmployeeStatus = async (req, res, next) => {
  var log_obj = {
    action: "update_employee_status",
    module: "preferences",
    sub_module: "employee status",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;
    const sys_employeeStatus = req.sys_employeeStatus;
    sys_employeeStatus.set({
      name,
    });
    const updated_sys_employeeStatus = await sys_employeeStatus.save();

    const message = "Employee status updated successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify({
      from: sys_employeeStatus,
      to: updated_sys_employeeStatus,
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
  createEmployeeStatus,
  getAllEmployeeStatuses,
  deleteEmployeeStatus,
  updateEmployeeStatus,
};
