const { User } = require("../models");
const { logInfo, logError } = require("./../utils/helper");
const allUsers = async (req, res, next) => {
  try {
    const system_users = await User.findAll();
    const message = "System users fetched successfully";
    logInfo(req, message, req.decoded.id);
    return res.status(200).send({
      status: "success",
      message,
      payload: {
        system_users,
      },
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
    allUsers,
};
