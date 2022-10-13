const express = require("express");
const { hasPermission } = require("../utils/helper");
const preferencesController = require("../controllers/preferencesController");
const rolesController = require("../controllers/rolesController");
const usersController = require("../controllers/usersController");
const departmentController = require("../controllers/departmentController");
const genderController = require("../controllers/genderController");
// middidleware
const {
  validateRole,
  validateUpdateRole,
} = require("../middleware/preferences/roles");
const { validateDepartment } = require("../middleware/preferences/departments");
const {
  validateGender,
  validateDeleteGender,
  validateUpdateGender,
} = require("../middleware/preferences/genders");

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
  authorizeMiddleware,
  validateRole,
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
  hasPermission("DELETE_ROLES"),
  rolesController.deleteRole
);
router.put(
  "/roles/:id",
  authorizeMiddleware,
  validateUpdateRole,
  hasPermission("CREATE_ROLES"),
  rolesController.updateRoles
);
router.put(
  "/roles-users/:id",
  // validateUpdateRole,
  authorizeMiddleware,
  hasPermission("EDIT_ROLES"),
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
  authorizeMiddleware,
  validateDepartment,
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
  hasPermission("DELETE_DEPARTMENT"),
  departmentController.deleteDepartment
);
router.put(
  "/departments/:id",
  authorizeMiddleware,
  validateDepartment,
  hasPermission("EDIT_ROLES"),
  departmentController.updateDepartment
);
// end department

// genders

router.post(
  "/genders",
  authorizeMiddleware,
  validateGender,
  hasPermission("CREATE_GENDER"),
  genderController.createGender
);
router.get(
  "/genders",
  authorizeMiddleware,
  hasPermission("VIEW_GENDER"),
  genderController.getAllGenders
);
router.delete(
  "/genders/:id",
  authorizeMiddleware,
  validateDeleteGender,
  hasPermission("DELETE_GENDER"),
  genderController.deleteGender
);
router.put(
  "/genders/:id",
  authorizeMiddleware,
  validateUpdateGender,
  hasPermission("EDIT_ROLES"),
  genderController.updateGender
);
// end genders

module.exports = router;
