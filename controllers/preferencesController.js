const { Permission } = require("../models");
const { logInfo, logError } = require("./../utils/helper");
const allPermissions = async (req, res, next) => {
  try {
    const system_permissions = await Permission.findAll();
    const result = system_permissions.reduce(function (r, a) {
      r[a.for] = r[a.for] || [];
      r[a.for].push(a);
      return r;
    }, Object.create(null));
    const message = "System permissions fetched successfully";
    logInfo(req, message, req.decoded.id);

    return res.status(200).send({
      status: "success",
      message,
      payload: {
        system_permissions: result,
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
  allPermissions,
};
