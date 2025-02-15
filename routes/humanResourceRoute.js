const express = require('express');

const { authorizeMiddleware } = require('../middleware/authorize');
const { createEmployee } = require('../controllers/hris/employeeController');
const { validateCreateEmployee } = require('../middleware/hris/createEmployee');

const router = express.Router();

// permissions
router.post(
  '/create-employee',
  authorizeMiddleware,
  validateCreateEmployee,
  createEmployee,
);

module.exports = router;
