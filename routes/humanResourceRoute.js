const express = require('express');

const { authorizeMiddleware } = require('../middleware/authorize');
const { createEmployee } = require('../controllers/hris/employeeController');

const router = express.Router();

// permissions
router.post('/create-employee', authorizeMiddleware, createEmployee);

module.exports = router;
