const { UserContact } = require('../../models');
const { logInfo, logError } = require('../../utils/logger'); // adjust this to your project structure
const { NODE_ENV } = process.env;

const createUserContact = async (req, res) => {
  const res_obj = { res, message: '', payload: {} };

  const log_obj = {
    action: 'create_user_contact',
    module: 'hris',
    sub_module: 'contact_information',
    payload: null,
    description: null,
    database: true,
  };

  try {
    const user_id = req.decoded?.id;
    if (!user_id) throw new Error('Unauthorized access');

    const {
      house_number,
      street_name,
      land_mark,
      lga,
      postal_code,
      state_id,
      country_id,
    } = req.body;

    // Deactivate all previous contacts
    await UserContact.update({ is_authorized: false }, { where: { user_id } });

    // Create new contact
    const newContact = await UserContact.create({
      user_id,
      created_by: user_id,
      house_number,
      street_name,
      land_mark,
      lga,
      postal_code,
      state_id,
      country_id,
      is_authorized: true,
    });

    const message = 'Contact information saved successfully';
    res_obj.message = message;
    res_obj.payload = { contact: newContact };
    log_obj.payload = JSON.stringify(newContact);

    logInfo(req, message, req.decoded.id, log_obj);
    return res.status(201).json({
      status: 'success',
      message,
      payload: {
        contact: newContact,
      },
    });
  } catch (error) {
    const message =
      NODE_ENV === 'development' ? error.message : 'Something went wrong';

    logError(req, message, req.decoded?.id || null, log_obj);

    return res.status(400).json({
      status: 'error',
      message,
      payload: {},
    });
  }
};

module.exports = { createUserContact };
