const { Country, User } = require("../models");
const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require("./../utils/helper");

const createCountry = async (req, res, next) => {
  try {
    const { name } = req.body;
    await Country.create({ name });

    const message = "Country created Successfully";
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

const getAllCountrys = async (req, res, next) => {
  try {
    const allCountrys = req.query.all;

    if (allCountrys === "all") {
      const countrys = await Country.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      const message = " Country fetched successfully";
      logInfo(req, message, req.decoded.id);
      const returnObj = {
        message,
        payload: {
          countrys,
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

      const countrys = await Country.findAll({
        include: [
          {
            model: User,
            as: "users",
            attributes: { exclude: ["password"] },
          },
        ],
        // group: "Country.id",
        limit: size,
        offset: page * size,
      });
      const total_count = await Country.count();
      const message = " Country fetched successfully";
      logInfo(req, message, req.decoded.id);
      const returnObj = {
        message,
        payload: {
          countrys,
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

const deleteCountry = async (req, res, next) => {
  try {
    const country = await req.Country.destroy();
    const message = "Country deleted successfully.";
    const returnObj = {
      res,
      message,
      payload: {
        country: country.id,
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

const updateCountry = async (req, res, next) => {
  try {
    const { name } = req.body;
    const sys_country = req.sys_country;
    sys_country.set({
      name,
    });
    await sys_country.save();

    const message = "Country updated successfully";
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
  createCountry,
  getAllCountrys,
  deleteCountry,
  updateCountry,
};
