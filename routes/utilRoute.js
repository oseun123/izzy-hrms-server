const express = require("express");

const usersController = require("../controllers/usersController");
const { authorizeMiddleware } = require("../middleware/authorize");

const router = express.Router();

// users
router.get("/system_users", authorizeMiddleware, usersController.systemUsers);

module.exports = router;
