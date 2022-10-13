const { Department, User } = require("../models");
const { logInfo, logError,returnError,returnSuccess } = require("./../utils/helper");

const createDepartment = async (req, res, next) => {
  try {
    const { name } = req.body;
    await Department.create({ name });

    const message = "Department created Successfully";
    logInfo(req, message, req.decoded.id);

    return returnSuccess ({
      status: "success",
      message,
      payload: {},
      res
    });
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    return returnError({
      status: "error",
      message: message,
      payload: {},
      res
    });
  }
};

const getAllDepartments = async (req, res, next) => {
  try {
    const alldepartments = req.query.all;

    if (alldepartments === "all") {
      const departments = await Department.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      const message = " Department fetched successfully";
      logInfo(req, message, req.decoded.id);

      return returnSuccess({
        status: "success",
        message,
        payload: {
          departments,
        },
        res
      });
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

      const departments = await Department.findAll({
        include: [
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
      logInfo(req, message, req.decoded.id);

      return returnSuccess({
        status: "success",
        message,
        payload: {
          departments,
          total_count,
          total_pages: Math.ceil(total_count / size),
        },
        res
      });
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    return returnError({
      status: "error",
      message: message,
      payload: {},
    });
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
  
     const department= await req.sys_department.destroy();
      const message = "department deleted successfully.";
      return returnSuccess({
        status: "success",
        message,
        payload: {
          department: department.id,
        },
        res
      });
   
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    return returnError({
      status: "error",
      message: message,
      payload: {},
      res
    });
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const { name } = req.body;
    const sys_department =req.sys_department;
   
      sys_department.set({
        name,
      });
      await sys_department.save();


    const message = " Department updated successfully";
    logInfo(req, message, req.decoded.id);

    return returnSuccess({
      status: "success",
      message,
      payload: {},
      res
    });
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    return returnError({
      status: "error",
      message: message,
      payload: {},
      res
    });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  deleteDepartment,
  updateDepartment,
};
