const { Department, User, sequelize } = require("../models");
const {
  logInfo,
  logError,
  returnError,
  returnSuccess,
} = require("./../utils/helper");
const { NODE_ENV } = process.env;
const createDepartment = async (req, res, next) => {
  var log_obj = {
    action: "create_department",
    module: "preferences",
    sub_module: "department",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name, hod } = req.body;

    const department = await Department.create({ name, hod });

    const message = "Department created Successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify(department);
    logInfo(req, message, req.decoded.id, log_obj);
    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    logError(req, message, req.decoded.id);
    return returnError(res_obj);
  }
};

const getAllDepartments = async (req, res, next) => {
  var log_obj = {
    action: "get_department",
    module: "preferences",
    sub_module: "department",
    payload: null,
    description: null,
  };

  var res_obj = { res, message: "", payload: {} };

  try {
    const alldepartments = req.query.all;

    if (alldepartments === "all") {
      const departments = await Department.findAll({
        include: [
          {
            model: User,
            as: "headOfDepartment", // Use the correct alias for the hod relationship
            attributes: {
              exclude: ["password"],
              include: [
                [
                  sequelize.literal(
                    "CONCAT(`headOfDepartment`.`first_name`, ' ', `headOfDepartment`.`last_name`)"
                  ),
                  "fullname",
                ],
              ],
            },
          },
          {
            model: User,
            as: "user",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      const message = " Department fetched successfully";
      res_obj.message = message;
      res_obj.payload = {
        departments,
      };
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

      const departments = await Department.findAll({
        include: [
          {
            model: User,
            as: "headOfDepartment", // Use the correct alias for the hod relationship
            attributes: {
              exclude: ["password"],
              include: [
                [
                  sequelize.literal(
                    "CONCAT(`headOfDepartment`.`first_name`, ' ', `headOfDepartment`.`last_name`)"
                  ),
                  "fullname",
                ],
              ],
            },
          },
          {
            model: User,
            as: "users",
            attributes: { exclude: ["password"] },
          },
        ],
        // group: "department.id",
        limit: size,
        offset: page * size,
      });
      const total_count = await Department.count();
      const message = " Department fetched successfully";
      res_obj.message = message;
      res_obj.payload = {
        departments,
        total_count,
        total_pages: Math.ceil(total_count / size),
      };
      logInfo(req, message, req.decoded.id, log_obj);
      return returnSuccess(res_obj);
    }
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";

    logError(req, message, req.decoded.id, log_obj);
    return returnError(res_obj);
  }
};

const deleteDepartment = async (req, res, next) => {
  var log_obj = {
    action: "delete_department",
    module: "preferences",
    sub_module: "department",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const department = await req.sys_department.destroy();
    const message = "department deleted successfully.";
    res_obj.message = message;
    log_obj.payload = JSON.stringify(department);
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

const updateDepartment = async (req, res, next) => {
  var log_obj = {
    action: "update_department",
    module: "preferences",
    sub_module: "department",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;
    const { hod } = req.body;
    const sys_department = req.sys_department;

    sys_department.set({
      name,
      hod,
    });
    const updated_department = await sys_department.save();

    const message = " Department updated successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify({
      from: sys_department,
      to: updated_department,
    });
    logInfo(req, message, req.decoded.id, log_obj);
    return returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    logError(req, message, req.decoded.id, log_obj);
    return returnError(res_obj);
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  deleteDepartment,
  updateDepartment,
};
