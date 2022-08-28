const express = require("express");
const { hasPermission } = require("../utils/helper");
const preferencesController = require("../controllers/preferencesController");
const rolesController = require("../controllers/rolesController");
const usersController = require("../controllers/usersController");
// middidleware
const {
  validateRole,
  validateUpdateRole,
} = require("../middleware/preferences/roles");
const { authorizeMiddleware } = require("../middleware/authorize");

const router = express.Router();
// permissions
router.get(
  "/permissions",
  authorizeMiddleware,
  preferencesController.allPermissions
);
// users
router.get("/users", authorizeMiddleware, usersController.allUsers);

// roles
router.post(
  "/roles",
  validateRole,
  authorizeMiddleware,
  hasPermission("CREATE_ROLES"),
  rolesController.createRoles
);
router.get(
  "/roles",
  authorizeMiddleware,
  hasPermission("VIEW_ROLES"),
  rolesController.getAllRoles
);
router.delete(
  "/roles/:id",
  authorizeMiddleware,
  hasPermission("CREATE_ROLES"),
  rolesController.deleteRole
);
router.put(
  "/roles/:id",
  validateUpdateRole,
  authorizeMiddleware,
  hasPermission("CREATE_ROLES"),
  rolesController.updateRoles
);
router.put(
  "/roles-users/:id",
  // validateUpdateRole,
  authorizeMiddleware,
  hasPermission("ASSIGN_ROLES"),
  rolesController.updateRolesUsers
);

module.exports = router;
