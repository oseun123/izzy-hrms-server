const { Permission, User, Role, Client } = require("../models");
const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require("./../utils/helper");
const { getUserPermissions } = require("./../utils/auth");

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
const userPermissions = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;

    var user = await User.findOne({
      where: { id: user_id },
      include: {
        model: Role,
        as: "roles",
        attributes: ["id"],
        include: {
          model: Permission,
          as: "permissions",
          attributes: ["id", "name", "for", "action", "menu", "url", "module"],
        },
      },
    });
    const permissions = getUserPermissions(user);

    const message = "Permissions fetched successfully";
    logInfo(req, message, req.decoded.id);
    return res.status(200).send({
      status: "success",
      message: "",
      payload: {
        userpermissions: permissions,
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
  userPermissions,
};
