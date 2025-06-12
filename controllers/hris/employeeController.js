const { User, Role } = require('../../models');
const { hashPassword } = require('../../utils/auth');
const sendEmail = require('../../utils/sendEmail');
const { employeeSetupTemplate } = require('../../utils/template/authTemplate');
const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
  generateSetupToken,
} = require('./../../utils/helper');

const { NODE_ENV, APP_NAME, APP_MAIL_FROM } = process.env;

const createEmployee = async (req, res, next) => {
  var log_obj = {
    action: 'create_employee',
    module: 'hris',
    sub_module: 'onboarding',
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: '', payload: {} };
  try {
    const {
      first_name,
      middle_name,
      last_name,
      employee_number,
      employment_date,
      department_id,
      grade_id,
      step_id,
      branch_id,
      company_id,
      designation_id,
      primary_supervisor,
      secondary_supervisor,
      employeestatus_id,
      employeecategory_id,
      email,
      country_id,
      state_id,
      gender_id,
    } = req.body;
    const setup_token = generateSetupToken();

    const new_employee = await User.create({
      first_name,
      middle_name,
      last_name,
      employee_number,
      employment_date,
      department_id,
      grade_id,
      step_id,
      branch_id,
      company_id,
      designation_id,
      primary_supervisor,
      secondary_supervisor,
      employeestatus_id,
      employeecategory_id,
      email,
      country_id,
      state_id,
      gender_id,
      setup_token,
    });
    // set defaultRole
    await setDefaultRole(new_employee);

    const message = 'Employee created Successfully';
    res_obj.message = message;
    log_obj.payload = JSON.stringify(new_employee);

    logInfo(req, message, req.decoded.id, log_obj);
    const sent = setupEmail(req, new_employee);
    if (!sent) {
      await new_employee.destroy();
      throw new Error('setup Email failed. User not created');
    }
    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
    logError(req, message, req.decoded.id, log_obj);

    returnError(res_obj);
  }
};

const setDefaultRole = async (new_employee) => {
  const defaultRole = await Role.findOne({ where: { default: 1 } });
  if (defaultRole) {
    await new_employee.addRole(defaultRole);
  } else {
    await new_employee.destroy(); // Delete the user if no default role is found
    throw new Error('Default role not found. User not created.');
  }
};
const setupEmail = async (req, user) => {
  const { protocol, hostname } = req;
  const port = NODE_ENV === 'development' ? ':3000' : '';
  const link = `${protocol}://${hostname}${port}/setup-password?token=${user.setup_token}`;
  const emailBody = await employeeSetupTemplate(link, user);

  const sent = await sendEmail(
    user.email,
    `${APP_MAIL_FROM}`,
    `${APP_NAME} account setup`,
    emailBody,
  );

  return sent;
};

const setPassword = async (req, res, next) => {
  const log_obj = {
    action: 'set_password',
    module: 'hris',
    sub_module: 'onboarding',
    payload: null,
    description: null,
    database: true,
  };

  const res_obj = { res, message: '', payload: {} };

  try {
    const { setup_token, password, password_confirmation } = req.body;

    if (!setup_token || !password || !password_confirmation) {
      throw new Error('Setup token, password, and confirmation are required');
    }

    if (password !== password_confirmation) {
      throw new Error('Password and confirmation do not match');
    }

    const user = await User.findOne({ where: { setup_token } });

    if (!user) {
      throw new Error('Invalid or expired setup token');
    }

    const hashedPassword = hashPassword(password);

    user.password = hashedPassword;
    user.setup_token = null; // clear token after use
    await user.save();

    const message = 'Password set successfully';
    res_obj.message = message;
    res_obj.payload = { user_id: user.id };

    log_obj.payload = JSON.stringify({ user_id: user.id });
    logInfo(req, message, req.decoded?.id || user.id, log_obj);

    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
    logError(req, message, req.decoded?.id, log_obj);

    returnError(res_obj);
  }
};

module.exports = {
  createEmployee,
  setPassword,
};
