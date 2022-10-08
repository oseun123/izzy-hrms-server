const { Department, User } = require("../models");
const { logInfo, logError } = require("./../utils/helper");

const createDepartment = async (req, res, next) => {
  try {
    const { name } = req.body;
    await Department.create({ name });

    const message = "Department created Successfully";
    logInfo(req, message, req.decoded.id);

    return res.status(200).send({
      status: "success",
      message,
      payload: {},
    });
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    return res.status(400).send({
      status: "error",
      message: message,
      payload: {},
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

      return res.status(200).send({
        status: "success",
        message,
        payload: {
          departments,
        },
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

      return res.status(200).send({
        status: "success",
        message,
        payload: {
          departments,
          total_count,
          total_pages: Math.ceil(total_count / size),
        },
      });
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    return res.status(400).send({
      status: "error",
      message: message,
      payload: {},
    });
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const department = req.params.id;
    const sys_department = await Department.findOne({
      where: { id: department },
      include: [
        {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
        },
      ],
    });
    console.log(sys_department);
    if (sys_department.dataValues.users.length) {
      const message = "Cannot delete department with users associated with it.";
      logError(req, message, req.decoded.id);
      return res.status(400).send({
        status: "error",
        message: message,
        payload: {},
      });
    } else {
      await sys_department.destroy();
      const message = "department deleted successfully.";
      return res.status(200).send({
        status: "success",
        message,
        payload: {
          department,
        },
      });
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    return res.status(400).send({
      status: "error",
      message: message,
      payload: {},
    });
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const { name } = req.body;

    const department = req.params.id;
    const sys_department = await Department.findOne({
      where: { id: department },
    });

    if (sys_department) {
      sys_department.set({
        name,
      });
      await sys_department.save();
    } else {
      const message = "Invalid department selection.";
      logError(req, message, req.decoded.id);
      return res.status(400).send({
        status: "error",
        message: message,
        payload: {},
      });
    }

    const message = " Department updated successfully";
    logInfo(req, message, req.decoded.id);

    return res.status(200).send({
      status: "success",
      message,
      payload: {},
    });
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    return res.status(400).send({
      status: "error",
      message: message,
      payload: {},
    });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  deleteDepartment,
  updateDepartment,
};
