const { Role, User, Permission } = require("../models");

const { logInfo, logError } = require("./../utils/helper");

const createRoles = async (req, res, next) => {
  try {
    const { name, permissions } = req.body;
    const default_req = req.body.default;
    const role = await Role.create({ name, default: default_req });
    await role.setPermissions(permissions);

    const message = " Role created Successfully";
    logInfo(req, message, req.decoded.id);

    return res.status(200).send({
      status: "success",
      message,
      payload: {},
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
const updateRoles = async (req, res, next) => {
  try {
    const { name, permissions } = req.body;
    const default_req = req.body.default;
    const role = req.params.id;
    const sys_role = await Role.findOne({
      where: { id: role },
    });

    if (sys_role) {
      sys_role.set({
        name,
        default: default_req,
      });
      await sys_role.save();
      await sys_role.setPermissions([]);
      await sys_role.setPermissions(permissions);
    } else {
      const message = "Invalid role selection.";
      logError(req, message, req.decoded.id);
      return res.status(400).send({
        status: "error",
        message: message,
        payload: {},
      });
    }
    // const role = await Role.create({ name, default: default_req });
    // await role.setPermissions(permissions);

    const message = " Role updated Successfully";
    logInfo(req, message, req.decoded.id);

    return res.status(200).send({
      status: "success",
      message,
      payload: {},
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
const updateRolesUsers = async (req, res, next) => {
  try {
    const { users } = req.body;

    // const default_req = req.body.default;
    const role = req.params.id;
    const sys_role = await Role.findOne({
      where: { id: role },
    });

    if (sys_role) {
      await sys_role.setUsers([]);
      await sys_role.setUsers(users);
    } else {
      const message = "Invalid role selection.";
      logError(req, message, req.decoded.id);
      return res.status(400).send({
        status: "error",
        message: message,
        payload: {},
      });
    }

    const message = " Users assigned Successfully";
    logInfo(req, message, req.decoded.id);

    return res.status(200).send({
      status: "success",
      message,
      payload: {},
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
const removeRolesUsers = async (req, res, next) => {
  try {
    const { user } = req.body;

    // const default_req = req.body.default;
    const role = req.params.id;
    const sys_role = await Role.findOne({
      where: { id: role },
    });

    if (sys_role) {
      await sys_role.removeUser(user);
    } else {
      const message = "Invalid role selection.";
      logError(req, message, req.decoded.id);
      return res.status(400).send({
        status: "error",
        message: message,
        payload: {},
      });
    }

    const message = " User remove successfully";
    logInfo(req, message, req.decoded.id);

    return res.status(200).send({
      status: "success",
      message,
      payload: {},
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

const getAllRoles = async (req, res, next) => {
  try {
    const allroles = req.query.all;

    if (allroles === "all") {
      const roles = await Role.findAll({
        include: [
          {
            model: User,
            as: "users",
            attributes: { exclude: ["password"] },
          },
          {
            model: Permission,
            as: "permissions",
            // attributes: [
            //   [
            //     sequelize.literal("COUNT(DISTINCT(permissions.id))"),
            //     "permissioncount",
            //   ],
            // ],
            // group: "permissions.id",
          },
        ],
      });

      const message = " Roles fetched successfully";
      logInfo(req, message, req.decoded.id);

      return res.status(200).send({
        status: "success",
        message,
        payload: {
          roles,
        },
      });
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
        !(sizeAsNumber > 10) &&
        !(sizeAsNumber < 1)
      ) {
        size = sizeAsNumber;
      }

      const roles = await Role.findAll({
        // attributes: [
        //   "name",
        //   "id",
        //   // [sequelize.fn("count", sequelize.col("users.id")), "sensorCount"],
        // ],
        include: [
          {
            model: User,
            as: "users",
            attributes: { exclude: ["password"] },
          },
          {
            model: Permission,
            as: "permissions",
            // attributes: [
            //   [
            //     sequelize.literal("COUNT(DISTINCT(permissions.id))"),
            //     "permissioncount",
            //   ],
            // ],
            // group: "permissions.id",
          },
        ],
        // group: "role.id",
        limit: size,
        offset: page * size,
      });
      const total_count = await Role.count();
      const message = " Roles fetched create Successfully";
      logInfo(req, message, req.decoded.id);

      return res.status(200).send({
        status: "success",
        message,
        payload: {
          roles,
          total_count,
          total_pages: Math.ceil(total_count / size),
        },
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

const deleteRole = async (req, res, next) => {
  try {
    const role = req.params.id;
    const sys_role = await Role.findOne({
      where: { id: role },
      include: [
        {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
        },
      ],
    });
    if (sys_role.dataValues.users.length) {
      const message = "Cannot delete role with users associated with it.";
      logError(req, message, req.decoded.id);
      return res.status(400).send({
        status: "error",
        message: message,
        payload: {},
      });
    } else {
      await sys_role.destroy();
      const message = "Role deleted successfully.";
      return res.status(200).send({
        status: "success",
        message,
        payload: {
          role,
        },
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

module.exports = {
  createRoles,
  getAllRoles,
  deleteRole,
  updateRoles,
  updateRolesUsers,
  removeRolesUsers,
};
