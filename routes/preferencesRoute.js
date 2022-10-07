const express = require("express");
const { hasPermission } = require("../utils/helper");
const preferencesController = require("../controllers/preferencesController");
const rolesController = require("../controllers/rolesController");
const usersController = require("../controllers/usersController");
const departmentController = require("../controllers/departmentController");
// middidleware
const {
  validateRole,
  validateUpdateRole,
} = require("../middleware/preferences/roles");
const { validateDepartment } = require("../middleware/preferences/departments");

const { authorizeMiddleware } = require("../middleware/authorize");

const router = express.Router();
// permissions
router.get(
  "/permissions",
  authorizeMiddleware,
  preferencesController.allPermissions
);
router.get(
  "/user-permissions/:user_id",
  authorizeMiddleware,
  // hasPermission("VIEW_ROLES"),
  preferencesController.userPermissions
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

router.put(
  "/roles-user/:id",
  // validateUpdateRole,
  authorizeMiddleware,
  hasPermission("ASSIGN_ROLES"),
  rolesController.removeRolesUsers
);

// end roles

// department

router.post(
  "/departments",
  validateDepartment,
  authorizeMiddleware,
  hasPermission("CREATE_DEPARTMENT"),
  departmentController.createDepartment
);
router.get(
  "/departments",
  authorizeMiddleware,
  hasPermission("VIEW_DEPARTMENT"),
  departmentController.getAllDepartments
);
router.delete(
  "/departments/:id",
  authorizeMiddleware,
  hasPermission("CREATE_DEPARTMENT"),
  departmentController.deleteDepartment
);
router.put(
  "/departments/:id",
  validateDepartment,
  authorizeMiddleware,
  hasPermission("CREATE_ROLES"),
  departmentController.updateDepartment
);
// end department

module.exports = router;
