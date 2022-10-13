const { Gender, User } = require("../models");
const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require("./../utils/helper");

const createGender = async (req, res, next) => {
  try {
    const { name } = req.body;
    await Gender.create({ name });

    const message = "Gender created Successfully";
    const returnObj = {
      status: "success",
      message,
      payload: {},
      res,
    };
    logInfo(req, message, req.decoded.id);
    return returnSuccess(returnObj);
  } catch (error) {
    const message = error.message;
    const returnObj = {
      status: "error",
      message,
      payload: {},
      res,
    };
    logError(req, message, req.decoded.id);

    return returnError(returnObj);
  }
};

const getAllGenders = async (req, res, next) => {
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
      logInfo(req, message, req.decoded.id);
      const returnObj = {
        status: "success",
        message,
        payload: {
          genders,
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
      logInfo(req, message, req.decoded.id);
      const returnObj = {
        status: "success",
        message,
        payload: {
          genders,
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
      status: "error",
      message: message,
      payload: {},
      res,
    };
    return returnError(returnObj);
  }
};

const deleteGender = async (req, res, next) => {
  try {
    const gender = await req.gender.destroy();
    const message = "Gender deleted successfully.";
    const returnObj = {
      res,
      status: "success",
      message,
      payload: {
        gender: gender.id,
      },
    };
    return returnSuccess(returnObj);
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    const returnObj = {
      res,
      status: "error",
      message: message,
      payload: {},
    };
    return returnError(returnObj);
  }
};

const updateGender = async (req, res, next) => {
  try {
    const { name } = req.body;
    const sys_gender = req.sys_gender;
    sys_gender.set({
      name,
    });
    await sys_gender.save();

    const message = "Gender updated successfully";
    logInfo(req, message, req.decoded.id);

    return returnSuccess({
      status: "success",
      message,
      payload: {},
      res,
    });
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    return returnError({
      status: "error",
      message: message,
      payload: {},
      res,
    });
  }
};

module.exports = {
  createGender,
  getAllGenders,
  deleteGender,
  updateGender,
};
