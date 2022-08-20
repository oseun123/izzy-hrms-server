const express = require("express");
const preferencesController = require("../controllers/preferencesController");
const rolesController = require("../controllers/rolesController");
// middidleware
const { validateRole } = require("../middleware/preferences/roles");
const { authorizeMiddleware } = require("../middleware/authorize");

const router = express.Router();

router.get(
  "/permissions",
  authorizeMiddleware,
  preferencesController.allPermissions
);

// roles
router.post(
  "/roles",
  validateRole,
  authorizeMiddleware,
  rolesController.createRoles
);
router.get("/roles", authorizeMiddleware, rolesController.getAllRoles);
router.delete("/roles/:id", authorizeMiddleware, rolesController.deleteRole);

module.exports = router;
