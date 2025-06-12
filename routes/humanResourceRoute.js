const express = require('express');

const { authorizeMiddleware } = require('../middleware/authorize');
const {
  createEmployee,
  setPassword,
} = require('../controllers/hris/employeeController');
const { validateCreateEmployee } = require('../middleware/hris/createEmployee');

const router = express.Router();

// permissions
router.post(
  '/create-employee',
  authorizeMiddleware,
  validateCreateEmployee,
  createEmployee,
);

router.post('/create-employee/setup-password', setPassword);

module.exports = router;
