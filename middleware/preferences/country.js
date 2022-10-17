const validator = require("validator");
const { Country, User } = require("../../models");
const { returnError, logError } = require("../../utils/helper");

async function validateCountry(req, res, next) {
  const { name } = req.body;

  if (name === "") {
    const returnObj = {
      message: "Name is required",
      payload: {},
      res,
    };
    return returnError(returnObj);
  } else {
    try {
      const is_name = await Country.findOne({ where: { name } });
      if (is_name) {
        const returnObj = {
          message: "Country already exist.",
          payload: {},
          res,
        };
        return returnError(returnObj);
      }
    } catch (error) {
      const returnObj = {
        message: error.message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }
  }

  next();
}
async function validateDeleteCountry(req, res, next) {
  try {
    const country = req.params.id;
    const sys_Country = await Country.findOne({
      where: { id: country },
      include: [
        {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    if (sys_Country.dataValues.users.length) {
      const message = "Cannot delete country with users associated with it.";
      logError(req, message, req.decoded.id);

      const returnObj = {
        message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }
    req.Country = sys_Country;
  } catch (error) {
    const returnObj = {
      message: error.message,
      payload: {},
      res,
    };
    return returnError(returnObj);
  }
  next();
}
async function validateUpdateCountry(req, res, next) {
  try {
    const country = req.params.id;
    const sys_country = await Country.findOne({
      where: { id: country },
    });

    if (sys_country) {
      req.sys_country = sys_country;
      next();
    } else {
      const message = "Invalid Country selection.";
      logError(req, message, req.decoded.id);
      return returnError({
        message: message,
        payload: {},
        res,
      });
    }
  } catch (error) {
    const returnObj = {
      message: error.message,
      payload: {},
      res,
    };
    return returnError(returnObj);
  }
}

module.exports = {
  validateCountry,
  validateDeleteCountry,
  validateUpdateCountry,
};
