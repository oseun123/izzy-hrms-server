const validator = require("validator");
const { Role } = require("../models");

async function validateRole(req, res, next) {
  const { name, permissions } = req.body;
  const defualt = req.body.default;

  if (!name) {
    return res.status(400).send({
      status: "error",
      message: "Name is required",
      payload: {},
    });
  } else {
    try {
      const is_name = await Role.findOne({ where: { name } });
      if (is_name) {
        return res.status(400).send({
          status: "error",
          message: "Role name already exist.",
          payload: {},
        });
      }
    } catch (error) {
      return res.status(400).send({
        status: "error",
        message: error.message,
        payload: {},
      });
    }
  }
  if (Array.isArray(permissions) && permissions.length === 0) {
    return res.status(400).send({
      status: "error",
      message: "Kindly select permissions for this role.",
      payload: {},
    });
  }
  if (defualt) {
    try {
      const default_role = await Role.findOne({
        where: { default: 1 },
      });
      if (default_role) {
        return res.status(400).send({
          status: "error",
          message: "Default role already exist in the system.",
          payload: {},
        });
      }
    } catch (error) {
      return res.status(400).send({
        status: "error",
        message: error.message,
        payload: {},
      });
    }
  }
  next();
}

module.exports = {
  validateRole,
};
