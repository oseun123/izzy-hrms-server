const express = require('express');

const { authorizeMiddleware } = require('../middleware/authorize');
const {
  createEmployee,
  setPassword,
  uploadProfilePic,
} = require('../controllers/hris/employeeController');
const {
  validateCreateEmployee,
  validateProfilePicUpload,
} = require('../middleware/hris/createEmployee');

const router = express.Router();

// permissions
router.post(
  '/create-employee',
  authorizeMiddleware,
  validateCreateEmployee,
  createEmployee,
);
router.post(
  '/upload-employee-pic',
  authorizeMiddleware,
  validateProfilePicUpload,
  uploadProfilePic,
);

router.post('/create-employee/setup-password', setPassword);

module.exports = router;
