const express = require("express");
const authController = require("../controllers/authController");
// middidleware
const { authMiddleware } = require("../middleware/auth");
const { authorizeMiddleware } = require("../middleware/authorize");

const router = express.Router();

// router.post("/sign_up", authMiddleware, authController.signUp);
// router.post("/sign_up", authController.signUp);
router.post("/sign_in", authController.signIn);
router.post("/forget_password", authController.sendResetLink);
router.post("/reset_password/:token", authController.resetPassword);
router.post("/logout", authorizeMiddleware, authController.logout);
router.get("/test", authorizeMiddleware, authController.test);
router.get("/refresh", authController.refresh);
router.get("/current_client/:client", authController.currentClient);

module.exports = router;
