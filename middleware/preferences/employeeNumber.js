const { returnError, logError } = require("../../utils/helper");

async function validateEmployeeNumberPrefix(req, res, next) {
  try {
    const { prefix } = req.body;
    if (prefix && prefix.length > 1) {
      next();
    } else {
      const message = "Invalid employee number prefix.";
      logError(req, message, req.decoded.id);
      return returnError({
        status: "error",
        message: message,
        payload: {},
        res,
      });
    }
  } catch (error) {
    const returnObj = {
      status: "error",
      message: error.message,
      payload: {},
      res,
    };
    return returnError(returnObj);
  }
}
async function validateEmployeeNumberStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (status.length > 0) {
      next();
    } else {
      const message = "Invalid employee number status.";
      logError(req, message, req.decoded.id);
      return returnError({
        status: "error",
        message: message,
        payload: {},
        res,
      });
    }
  } catch (error) {
    const returnObj = {
      status: "error",
      message: error.message,
      payload: {},
      res,
    };
    return returnError(returnObj);
  }
}

module.exports = {
  validateEmployeeNumberPrefix,
  validateEmployeeNumberStatus,
};
