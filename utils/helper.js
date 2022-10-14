const logger = require("./../utils/logger");
const { AuditLog, User, Permission, Role } = require("./../models");
const { getUserPermissions } = require("./auth");

const getClientAddress = (req) => {
  return {
    clientAddress:
      (req.headers["x-forwarded-for"] || "").split(",")[0] ||
      req.connection.remoteAddress,
  };
};
const getUserAgent = (req) => {
  return {
    userAgent: req.headers["user-agent"],
  };
};

const logInfo = (req, message, user_id = null) => {
  const ip = getClientAddress(req);
  const userAgent = getUserAgent(req);
  const id = { user_id };

  // AuditLog.create({
  //   user_id,
  //   ip: JSON.stringify(ip),
  //   user_agent: JSON.stringify(userAgent),
  //   message,
  // });
  return logger.info(
    `${message}--${JSON.stringify(ip)}--${JSON.stringify(
      userAgent
    )}--${JSON.stringify(id)}`
  );
};
const logError = (req, message, user_id = null) => {
  const ip = getClientAddress(req);
  const userAgent = getUserAgent(req);
  const id = { user_id };
  // AuditLog.create({
  //   user_id,
  //   ip: JSON.stringify(ip),
  //   user_agent: JSON.stringify(userAgent),
  //   message,
  // });
  return logger.error(
    `${message}--${JSON.stringify(ip)}--${JSON.stringify(
      userAgent
    )}--${JSON.stringify(id)}`
  );
};

const hasPermission = (perm) => {
  return async (req, res, next) => {
    try {
      const user_id = req.decoded.id;
      const user = await User.findOne({
        where: { id: user_id },
        include: {
          model: Role,
          as: "roles",
          attributes: ["id"],
          include: {
            model: Permission,
            as: "permissions",
            attributes: [
              "id",
              "name",
              "for",
              "action",
              "menu",
              "url",
              "module",
            ],
          },
        },
      });
      let perm_array = [];
      const permissions = getUserPermissions(user);
      permissions.forEach((permission) => {
        perm_array.push(permission.dataValues.action);
      });
      if (perm_array.includes(perm)) {
        next();
      } else {
        const message = "Not authorized to perform this action.";
        logError(req, message, req.decoded.id);
        return res.status(400).send({
          status: "error",
          message: message,
          payload: {},
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
};

const returnSuccess = (obj) => {
  return obj.res.status(200).send({
    status: "success",
    message: obj.message,
    payload: obj.payload,
  });
};
const returnError = (obj) => {
  return obj.res.status(400).send({
    status: "error",
    message: obj.message,
    payload: obj.payload,
  });
};
module.exports = {
  getClientAddress,
  getUserAgent,
  logInfo,
  logError,
  hasPermission,
  returnSuccess,
  returnError,
};
