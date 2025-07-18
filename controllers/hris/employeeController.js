const {
  User,
  Role,
  EmployeeNumber,
  UserProfilePic,
  Client,
} = require('../../models');
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

const cloudinary = require('./../../config/cloudinary');

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
    // increase emp number
    await increaseEmpNumber();

    const message = 'Employee created Successfully';
    res_obj.message = message;
    log_obj.payload = JSON.stringify(new_employee);

    // send email only if employee is active

    if (parseInt(employeestatus_id) === 1) {
      const sent = await setupEmail(req, new_employee);

      // console.log({ sent });
      if (!sent) {
        await new_employee.destroy();
        throw new Error('setup Email failed. User not created');
      }
    }

    logInfo(req, message, req.decoded.id, log_obj);
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
  console.log('here');
  const sent = await sendEmail(
    user.email,
    `oseun04@gmail.com`,
    `${APP_NAME} account setup`,
    emailBody,
  );
  console.log('here1');
  return sent;
};

const increaseEmpNumber = async () => {
  const format = await EmployeeNumber.findByPk(1);
  const sequence = format.sequence;
  const status = format.status;

  if (status) {
    const new_seque = parseInt(sequence, 10) + 1;
    const new_sequence = new_seque.toString().padStart(sequence.length, '0');

    format.set({
      sequence: new_sequence,
    });
    await format.save();
  }
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

const uploadProfilePic = async (req, res) => {
  const log_obj = {
    action: 'upload_profile_pic',
    module: 'hris',
    sub_module: 'onboarding',
    payload: null,
    description: null,
    database: true,
  };

  const res_obj = { res, message: '', payload: {} };
  const { user_id } = req.body;

  try {
    // Confirm user exists
    const user = await User.findByPk(user_id);
    const client = await Client.findOne({ where: { id: 1 } });
    const company_name = client
      ? client.dataValues.name + ' HRMS'
      : 'Your Company';
    if (!user) {
      throw new Error('User not found');
    }

    const file = req.files.image;

    // Upload to Cloudinary using upload_stream (without public_id)
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `${company_name}/profile_pics`,
            transformation: [{ width: 500, height: 500, crop: 'limit' }],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        stream.end(file.data); // stream from buffer
      });

    const result = await streamUpload();

    // Deactivate old profile picture(s)
    await UserProfilePic.update(
      { status: 'inactive' },
      { where: { user_id, status: 'active' } },
    );

    // Save new profile picture
    const pic = await UserProfilePic.create({
      user_id,
      image_url: result.secure_url,
      status: 'active',
      created_by: req.decoded.id,
    });

    const message = 'Profile picture uploaded successfully';
    res_obj.message = message;
    res_obj.payload = { ...pic };

    log_obj.payload = JSON.stringify({ ...pic });
    logInfo(req, message, req.decoded?.id || user.id, log_obj);

    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === 'development' ? message : 'Something went wrong';

    logError(req, message, req.decoded?.id, log_obj);
    returnError(res_obj);
  }
};

const getCurrentProfilePic = async (req, res) => {
  const log_obj = {
    action: 'get_current_profile_pic',
    module: 'hris',
    sub_module: 'onboarding',
    payload: null,
    description: null,
    database: false,
  };

  const res_obj = { res, message: '', payload: {} };
  const { user_id } = req.query;

  try {
    // Validate user_id
    if (!user_id || isNaN(user_id)) {
      throw new Error('A valid user_id is required');
    }

    //Confirm user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    //Find active profile picture
    const profilePic = await UserProfilePic.findOne({
      where: { user_id, status: 'active' },
    });

    if (!profilePic) {
      throw new Error('No active profile picture found');
    }

    const message = 'Current profile picture retrieved successfully';
    res_obj.message = message;
    res_obj.payload = { profile_pic: profilePic };

    log_obj.payload = JSON.stringify(profilePic);
    logInfo(req, message, req.decoded?.id || user.id, log_obj);

    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === 'development' ? message : 'Something went wrong';

    logError(req, message, req.decoded?.id, log_obj);
    returnError(res_obj);
  }
};

const deleteProfilePic = async (req, res) => {
  const log_obj = {
    action: 'delete_profile_pic',
    module: 'hris',
    sub_module: 'onboarding',
    payload: null,
    description: null,
    database: true,
  };

  const res_obj = { res, message: '', payload: {} };
  const { user_id } = req.query;

  try {
    //  Validate user_id
    if (!user_id || isNaN(user_id)) {
      throw new Error('A valid user_id is required');
    }

    //Confirm user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    // Get active profile picture
    const pic = await UserProfilePic.findOne({
      where: { user_id, status: 'active' },
    });

    if (!pic) {
      throw new Error('No active profile picture found');
    }

    await pic.update({ status: 'inactive' });

    const message = 'Profile picture deleted successfully';
    res_obj.message = message;
    res_obj.payload = { deleted_id: pic.id };

    log_obj.payload = JSON.stringify({ deleted_id: pic.id });
    logInfo(req, message, req.decoded?.id || user.id, log_obj);

    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === 'development' ? message : 'Something went wrong';

    logError(req, message, req.decoded?.id, log_obj);
    returnError(res_obj);
  }
};

module.exports = {
  createEmployee,
  setPassword,
  uploadProfilePic,
  getCurrentProfilePic,
  deleteProfilePic,
};
