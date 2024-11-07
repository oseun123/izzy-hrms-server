const { Role, User, Permission } = require("../models");

const {
  logInfo,
  logError,
  returnError,
  returnSuccess,
} = require("./../utils/helper");
const { NODE_ENV } = process.env;

const createRoles = async (req, res, next) => {
  var log_obj = {
    action: "create_role",
    module: "preferences",
    sub_module: "role",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name, permissions } = req.body;
    const default_req = req.body.default;
    const role = await Role.create({ name, default: default_req });
    await role.setPermissions(permissions);

    const message = " Role created Successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify(role);
    log_obj.description = JSON.stringify({ permissions });
    logInfo(req, message, req.decoded.id, log_obj);
    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    logError(req, message, req.decoded.id, log_obj);
    returnError(res_obj);
  }
};
const updateRoles = async (req, res, next) => {
  var log_obj = {
    action: "update_role",
    module: "preferences",
    sub_module: "role",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const { name, permissions } = req.body;
    const default_req = req.body.default;
    const role = req.params.id;
    const sys_role = await Role.findOne({
      where: { id: role },
      include: [
        {
          model: Permission,
          as: "permissions",
        },
      ],
    });

    if (sys_role) {
      sys_role.set({
        name,
        default: default_req,
      });
      var updated_role = await sys_role.save();
      await sys_role.setPermissions([]);
      await sys_role.setPermissions(permissions);
    } else {
      const message = "Invalid role selection.";
      res_obj.message = message;
      log_obj.database = false;
      logError(req, message, req.decoded.id, log_obj);
      returnError(res_obj);
    }

    const message = "Role updated Successfully";
    res_obj.message = message;

    log_obj.payload = JSON.stringify({
      from: sys_role,
      to: updated_role,
    });
    log_obj.description = JSON.stringify({ permissions });
    logInfo(req, message, req.decoded.id, log_obj);

    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    logError(req, message, req.decoded.id, log_obj);
    returnError(res_obj);
  }
};
const updateRolesUsers = async (req, res, next) => {
  var log_obj = {
    action: "assign_user",
    module: "preferences",
    sub_module: "role",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
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
      res_obj.message = message;
      log_obj.database = false;
      logError(req, message, req.decoded.id, log_obj);
      returnError(res_obj);
    }

    const message = "Users assigned Successfully";
    res_obj.message = message;
    log_obj.database = false;
    logInfo(req, message, req.decoded.id, log_obj);
    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    logError(req, message, req.decoded.id);
    returnError(res_obj);
  }
};
const removeRolesUsers = async (req, res, next) => {
  var log_obj = {
    action: "remove_user",
    module: "preferences",
    sub_module: "role",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
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
      res_obj.message = message;
      log_obj.database = false;
      logError(req, message, req.decoded.id, log_obj);
      return returnError(res_obj);
    }

    const message = " User remove successfully";
    res_obj.message = message;
    log_obj.database = false;
    logInfo(req, message, req.decoded.id, log_obj);

    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    logError(req, message, req.decoded.id, log_obj);
    return returnError(res_obj);
  }
};

const getAllRoles = async (req, res, next) => {
  var log_obj = {
    action: "get_role",
    module: "preferences",
    sub_module: "role",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
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
      res_obj.message = message;
      res_obj.payload = {
        roles,
      };
      log_obj.database = false;
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

      res_obj.message = message;
      res_obj.payload = {
        roles,
        total_count,
        total_pages: Math.ceil(total_count / size),
      };
      log_obj.database = false;
      logInfo(req, message, req.decoded.id, log_obj);

      return returnSuccess(res_obj);
    }
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    returnError(res_obj);
  }
};

const deleteRole = async (req, res, next) => {
  var log_obj = {
    action: "delete_role",
    module: "preferences",
    sub_module: "role",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
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
      res_obj.message = message;
      log_obj.database = false;
      logError(req, message, req.decoded.id, log_obj);
      returnError(res_obj);
    } else {
      const deleted_role = await sys_role.destroy();
      const message = "Role deleted successfully.";
      res_obj.message = message;
      res_obj.payload = {
        role,
      };
      res_obj.payload = JSON.stringify(deleted_role);
      returnSuccess(res_obj);
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id, log_obj);
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    returnError(res_obj);
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
