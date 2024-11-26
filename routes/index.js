/**
 * API Routes
 *
 * @module routes
 * @description This module defines and exports the main API router that combines all sub-route handlers.
 *
 * @requires express
 * @requires authRoute
 * @requires preferencesRoute
 * @requires utilRoute
 */

const express = require("express");
const router = express.Router();

const authRoute = require("./authRoute");
const preferencesRoute = require("./preferencesRoute");
const utilRoute = require("./utilRoute");

/**
 * Authentication Routes
 *
 * @route {GET|POST|PUT|DELETE} /auth
 * @description Handles authentication-related operations, such as login and registration.
 */
router.use("/auth", authRoute);

/**
 * Preferences Routes
 *
 * @route {GET|POST|PUT|DELETE} /preferences
 * @description Manages user preferences and related configurations.
 */
router.use("/preferences", preferencesRoute);

/**
 * Utility Routes
 *
 * @route {GET|POST|PUT|DELETE} /utils
 * @description Provides utility functions, such as file handling or miscellaneous operations.
 */
router.use("/utils", utilRoute);

module.exports = router;
