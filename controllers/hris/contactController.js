const { UserContact, User, State, Country } = require('../../models');
const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require('../../utils/helper');
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
    returnSuccess(res_obj);
  } catch (error) {
    const message =
      NODE_ENV === 'development' ? error.message : 'Something went wrong';

    logError(req, message, req.decoded?.id || null, log_obj);

    returnError(res_obj);
  }
};

const getUserContact = async (req, res) => {
  const log_obj = {
    action: 'get_user_contact_info',
    module: 'hris',
    sub_module: 'contact',
    payload: null,
    description: null,
    database: false,
  };

  const res_obj = { res, message: '', payload: {} };

  try {
    const user_id = req.query.user_id || req.decoded?.id;

    if (!user_id || isNaN(user_id)) {
      throw new Error('A valid user_id is required');
    }

    // Confirm user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    // Get authorized contact info with state and country
    const contact = await UserContact.findOne({
      where: {
        user_id,
        is_authorized: true,
      },
      include: [
        { model: State, as: 'state', attributes: ['id', 'name'] },
        { model: Country, as: 'country', attributes: ['id', 'name'] },
      ],
    });

    if (!contact) {
      throw new Error('No authorized contact info found');
    }

    const message = 'Contact information retrieved successfully';
    res_obj.message = message;
    res_obj.payload = { contact };
    log_obj.payload = JSON.stringify(contact);

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

module.exports = { createUserContact, getUserContact };
