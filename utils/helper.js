const logger = require("./../utils/logger");
const { AuditLog } = require("./../models");

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

  AuditLog.create({
    user_id,
    ip: JSON.stringify(ip),
    user_agent: JSON.stringify(userAgent),
    message,
  });
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
  AuditLog.create({
    user_id,
    ip: JSON.stringify(ip),
    user_agent: JSON.stringify(userAgent),
    message,
  });
  return logger.error(
    `${message}--${JSON.stringify(ip)}--${JSON.stringify(
      userAgent
    )}--${JSON.stringify(id)}`
  );
};

module.exports = {
  getClientAddress,
  getUserAgent,
  logInfo,
  logError,
};
