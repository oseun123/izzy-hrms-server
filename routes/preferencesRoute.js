const express = require("express");
const { hasPermission } = require("../utils/helper");
const preferencesController = require("../controllers/preferencesController");
const rolesController = require("../controllers/rolesController");
const usersController = require("../controllers/usersController");
const departmentController = require("../controllers/departmentController");
const genderController = require("../controllers/genderController");
const stateController = require("../controllers/stateController");
const countryController = require("../controllers/countryController");
const companyController = require("../controllers/companyController");
const branchController = require("../controllers/branchController");

// middidleware
const {
  validateRole,
  validateUpdateRole,
} = require("../middleware/preferences/roles");
const {
  validateDepartment,
  validateDeleteDepartment,
  validateUpdateDepartment,
} = require("../middleware/preferences/departments");
const {
  validateGender,
  validateDeleteGender,
  validateUpdateGender,
} = require("../middleware/preferences/genders");

const {
  validateState,
  validateDeleteState,
  validateUpdateState,
} = require("../middleware/preferences/states");

const {
  validateCountry,
  validateDeleteCountry,
  validateUpdateCountry,
} = require("../middleware/preferences/country");

const {
  validateCompany,
  validateDeleteCompany,
  validateUpdateCompany,
} = require("../middleware/preferences/company");
const {
  validateBranch,
  validateDeleteBranch,
  validateUpdateBranch,
} = require("../middleware/preferences/branch");

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
  validateDeleteDepartment,
  hasPermission("DELETE_DEPARTMENT"),
  departmentController.deleteDepartment
);
router.put(
  "/departments/:id",
  authorizeMiddleware,
  validateUpdateDepartment,
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
  hasPermission("EDIT_GENDER"),
  genderController.updateGender
);
// end genders

// states

router.post(
  "/states",
  authorizeMiddleware,
  validateState,
  hasPermission("CREATE_STATES"),
  stateController.createState
);
router.get(
  "/states",
  authorizeMiddleware,
  hasPermission("VIEW_STATES"),
  stateController.getAllStates
);
router.delete(
  "/states/:id",
  authorizeMiddleware,
  validateDeleteState,
  hasPermission("DELETE_STATES"),
  stateController.deleteState
);
router.put(
  "/states/:id",
  authorizeMiddleware,
  validateUpdateState,
  hasPermission("EDIT_STATES"),
  stateController.updateState
);
// end states

// country
router.post(
  "/countries",
  authorizeMiddleware,
  validateCountry,
  hasPermission("CREATE_COUNTRY"),
  countryController.createCountry
);
router.get(
  "/countries",
  authorizeMiddleware,
  hasPermission("VIEW_COUNTRY"),
  countryController.getAllCountrys
);
router.delete(
  "/countries/:id",
  authorizeMiddleware,
  validateDeleteCountry,
  hasPermission("DELETE_COUNTRY"),
  countryController.deleteCountry
);
router.put(
  "/countries/:id",
  authorizeMiddleware,
  validateUpdateCountry,
  hasPermission("EDIT_COUNTRY"),
  countryController.updateCountry
);
// end country

// companies
router.post(
  "/companies",
  authorizeMiddleware,
  validateCompany,
  hasPermission("CREATE_COMPANY"),
  companyController.createCompany
);
router.get(
  "/companies",
  authorizeMiddleware,
  hasPermission("VIEW_COMPANY"),
  companyController.getAllCompanies
);
router.delete(
  "/companies/:id",
  authorizeMiddleware,
  validateDeleteCompany,
  hasPermission("DELETE_COMPANY"),
  companyController.deleteCompany
);
router.put(
  "/companies/:id",
  authorizeMiddleware,
  validateUpdateCompany,
  hasPermission("EDIT_COMPANY"),
  companyController.updateCompany
);
// end company

// branches
router.post(
  "/branches",
  authorizeMiddleware,
  validateBranch,
  hasPermission("CREATE_BRANCH"),
  branchController.createBranch
);
router.get(
  "/branches",
  authorizeMiddleware,
  hasPermission("VIEW_BRANCH"),
  branchController.getAllBranches
);
router.delete(
  "/branches/:id",
  authorizeMiddleware,
  validateDeleteBranch,
  hasPermission("DELETE_BRANCH"),
  branchController.deleteBranch
);
router.put(
  "/branches/:id",
  authorizeMiddleware,
  validateUpdateBranch,
  validateBranch,
  hasPermission("EDIT_BRANCH"),
  branchController.updateBranch
);
// end branch

module.exports = router;
