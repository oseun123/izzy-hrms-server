const express = require('express');

const { authorizeMiddleware } = require('../middleware/authorize');
const {
  createEmployee,
  setPassword,
  uploadProfilePic,
  getCurrentProfilePic,
  deleteProfilePic,
} = require('../controllers/hris/employeeController');
const {
  validateCreateEmployee,
  validateProfilePicUpload,
} = require('../middleware/hris/createEmployee');

const router = express.Router();

// employee
router.post(
  '/create-employee',
  authorizeMiddleware,
  validateCreateEmployee,
  createEmployee,
);

router.post('/create-employee/setup-password', setPassword);

// employee profile pic
router.post(
  '/upload-employee-pic',
  authorizeMiddleware,
  validateProfilePicUpload,
  uploadProfilePic,
);
router.get('/get-employee-pic', authorizeMiddleware, getCurrentProfilePic);
router.delete('/delete-employee-pic', authorizeMiddleware, deleteProfilePic);
module.exports = router;
