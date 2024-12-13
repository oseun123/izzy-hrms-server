const { Country, User } = require('../models');
const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require('./../utils/helper');
const { NODE_ENV } = process.env;

const createCountry = async (req, res, next) => {
  var log_obj = {
    action: 'create_country',
    module: 'preferences',
    sub_module: 'country',
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: '', payload: {} };
  try {
    const { name } = req.body;
    const country = await Country.create({ name });
    const message = 'Country created Successfully';
    res_obj.message = message;
    log_obj.payload = JSON.stringify(country);
    logInfo(req, message, req.decoded.id, log_obj);
    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id, log_obj);
    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
    returnError(res_obj);
  }
};

const getAllCountrys = async (req, res, next) => {
  var log_obj = {
    action: 'get_country',
    module: 'preferences',
    sub_module: 'country',
    payload: null,
    description: null,
  };

  var res_obj = { res, message: '', payload: {} };
  try {
    const allCountrys = req.query.all;

    if (allCountrys === 'all') {
      const countrys = await Country.findAll({
        include: [
          {
            model: User,
            as: 'users',
            attributes: { exclude: ['password'] },
          },
        ],
      });

      const message = ' Country fetched successfully';

      res_obj.message = message;
      res_obj.payload = { countrys };

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

      const countrys = await Country.findAll({
        include: [
          {
            model: User,
            as: 'users',
            attributes: { exclude: ['password'] },
          },
        ],
        // group: "Country.id",
        limit: size,
        offset: page * size,
      });
      const total_count = await Country.count();
      const message = ' Country fetched successfully';
      res_obj.message = message;
      res_obj.payload = {
        countrys,
        total_count,
        total_pages: Math.ceil(total_count / size),
      };
      logInfo(req, message, req.decoded.id, log_obj);
      returnSuccess(res_obj);
    }
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';

    logError(req, message, req.decoded.id, log_obj);
    returnError(res_obj);
  }
};

const deleteCountry = async (req, res, next) => {
  var log_obj = {
    action: 'delete_country',
    module: 'preferences',
    sub_module: 'country',
    payload: null,
    description: null,
  };

  var res_obj = { res, message: '', payload: {} };
  try {
    const country = await req.Country.destroy();
    const message = 'Country deleted successfully.';
    res_obj.message = message;
    res_obj.payload = {
      country: country.id,
    };
    log_obj.payload = JSON.stringify(country);
    return returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
    logError(req, message, req.decoded.id, log_obj);
    return returnError(res_obj);
  }
};

const updateCountry = async (req, res, next) => {
  var log_obj = {
    action: 'update_country',
    module: 'preferences',
    sub_module: 'country',
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: '', payload: {} };
  try {
    const { name } = req.body;
    const sys_country = req.sys_country;
    sys_country.set({
      name,
    });
    const updated_country = await sys_country.save();

    const message = 'Country updated successfully';
    res_obj.message = message;
    log_obj.payload = JSON.stringify({
      from: sys_country,
      to: updated_country,
    });

    logInfo(req, message, req.decoded.id, log_obj);

    return returnSuccess(res_obj);
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
