const express = require('express');

const { authorizeMiddleware } = require('../middleware/authorize');
// users
const {
  createEmployee,
  setPassword,
  uploadProfilePic,
  getCurrentProfilePic,
  deleteProfilePic,
  updateEmployee,
} = require('../controllers/hris/employeeController');

const {
  validateCreateEmployee,
  validateProfilePicUpload,
} = require('../middleware/hris/createEmployee');

// user contact
const {
  createUserContact,
  getUserContact,
} = require('../controllers/hris/contactController');
const { validateContact } = require('../middleware/hris/createContact');

const router = express.Router();

// employee
router.post(
  '/create-employee',
  authorizeMiddleware,
  validateCreateEmployee,
  createEmployee,
);
router.post(
  '/update-employee',
  authorizeMiddleware,
  validateCreateEmployee,
  updateEmployee,
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

// employee contact

router.post(
  '/set-contact',
  authorizeMiddleware,
  validateContact,
  createUserContact,
);
router.get('/get-contact', authorizeMiddleware, getUserContact);

module.exports = router;
