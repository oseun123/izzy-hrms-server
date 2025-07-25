const { returnError } = require('../../utils/helper');
const validator = require('validator');

async function validateContact(req, res, next) {
  console.log({ req: req.body });
  const {
    house_number,
    street_name,
    land_mark,
    lga,
    postal_code,
    state_id,
    country_id,
  } = req.body;

  if (house_number === '' || house_number === undefined) {
    return returnError({
      message: 'House number is required',
      payload: {},
      res,
    });
  }

  if (street_name === '' || street_name === undefined) {
    return returnError({
      message: 'Street name is required',
      payload: {},
      res,
    });
  }

  if (land_mark === '' || land_mark === undefined) {
    return returnError({
      message: 'Landmark is required',
      payload: {},
      res,
    });
  }

  if (lga === '' || lga === undefined) {
    return returnError({
      message: 'LGA is required',
      payload: {},
      res,
    });
  }

  if (state_id === '' || state_id === undefined) {
    return returnError({
      message: 'State is required',
      payload: {},
      res,
    });
  }

  if (country_id === '' || country_id === undefined) {
    return returnError({
      message: 'Country is required',
      payload: {},
      res,
    });
  }

  if (postal_code && !validator.isPostalCode(postal_code, 'any')) {
    return returnError({
      message: 'Provide a valid postal code',
      payload: {},
      res,
    });
  }

  next();
}

module.exports = { validateContact };
