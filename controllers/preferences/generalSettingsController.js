const { EmployeeNumber } = require('../../models');

const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require('./../../utils/helper');

const { NODE_ENV } = process.env;

async function getEmployeeNumberFormat(req, res, next) {
  var log_obj = {
    action: 'get_employee_number_format',
    module: 'preferences',
    sub_module: 'Settings',
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: '', payload: {} };

  try {
    const format = await EmployeeNumber.findByPk(1);

    const message = 'Employee number fetched successfully';
    res_obj.message = message;
    res_obj.payload = {
      format,
      format_string: `${format.prefix}-${format.sequence}${
        format.suffix ? `-${format.suffix}` : ''
      }`,
    };

    log_obj.database = false;
    logInfo(req, message, req.decoded.id, log_obj);

    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
    logError(req, message, req.decoded.id, log_obj);

    returnError(res_obj);
  }
}

async function editEmployeeNumberPrefix(req, res, next) {
  var log_obj = {
    action: 'edit_employee_number_prefix',
    module: 'preferences',
    sub_module: 'Settings',
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: '', payload: {} };

  try {
    const { prefix } = req.body;
    const format = await EmployeeNumber.findByPk(1);
    format.set({
      prefix,
    });
    updated_format = await format.save();

    const message = 'Prefix updated successfully';
    res_obj.message = message;
    res_obj.payload = {
      format: updated_format,
      format_string: `${updated_format.prefix}-${updated_format.sequence}${
        updated_format.suffix ? `-${updated_format.suffix}` : ''
      }`,
    };
    log_obj.payload = JSON.stringify({
      from: format,
      to: updated_format,
    });

    logInfo(req, message, req.decoded.id, log_obj);
    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
    logError(req, message, req.decoded.id, log_obj);
    returnError(res_obj);
  }
}
async function editEmployeeNumberSuffix(req, res, next) {
  var log_obj = {
    action: 'edit_employee_number_suffix',
    module: 'preferences',
    sub_module: 'Settings',
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: '', payload: {} };

  try {
    const { suffix } = req.body;
    const format = await EmployeeNumber.findByPk(1);
    format.set({
      suffix,
    });
    updated_format = await format.save();

    const message = 'Suffix updated successfully';
    res_obj.message = message;

    res_obj.payload = {
      format: updated_format,
      format_string: `${updated_format.prefix}-${updated_format.sequence}${
        updated_format.suffix ? `-${updated_format.suffix}` : ''
      }`,
    };
    log_obj.payload = JSON.stringify({
      from: format,
      to: updated_format,
    });

    logInfo(req, message, req.decoded.id, log_obj);

    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
    logError(req, message, req.decoded.id, log_obj);
    returnError(res_obj);
  }
}
async function getNextEmployeeNumber(req, res, next) {
  var log_obj = {
    action: 'set_next_employee_number',
    module: 'preferences',
    sub_module: 'Settings',
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: '', payload: {} };

  try {
    const format = await EmployeeNumber.findByPk(1);
    const sequence = format.sequence;
    const new_seque = parseInt(sequence, 10) + 1;
    const new_sequence = new_seque.toString().padStart(sequence.length, '0');

    format.set({
      sequence: new_sequence,
    });
    const updated_format = await format.save();

    const message = 'Sequence increased successfully';
    res_obj.message = message;
    res_obj.payload = {
      format: updated_format,
      format_string: `${updated_format.suffix}-${updated_format.sequence}${
        updated_format.suffix ? `-${updated_format.suffix}` : ''
      }`,
    };
    log_obj.payload = JSON.stringify({
      from: format,
      to: updated_format,
    });

    logInfo(req, message, req.decoded.id, log_obj);
    return res_obj;
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
    logError(req, message, req.decoded.id, log_obj);
    // returnError(res_obj);
  }
}

async function editEmployeeNumberStatus(req, res, next) {
  var log_obj = {
    action: 'edit_employee_number_status',
    module: 'preferences',
    sub_module: 'Settings',
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: '', payload: {} };

  try {
    const { status } = req.body;

    const n_status = toBinary(status);
    const format = await EmployeeNumber.findByPk(1);
    format.set({
      status: n_status,
    });
    updated_format = await format.save();

    const message = 'Status updated successfully';
    res_obj.message = message;

    res_obj.payload = {
      format: updated_format,
      format_string: `${updated_format.prefix}-${updated_format.sequence}${
        updated_format.suffix ? `-${updated_format.suffix}` : ''
      }`,
    };
    log_obj.payload = JSON.stringify({
      from: format,
      to: updated_format,
    });

    logInfo(req, message, req.decoded.id, log_obj);

    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
    logError(req, message, req.decoded.id, log_obj);
    returnError(res_obj);
  }
}

function toBinary(value) {
  return value === '0' ||
    value === 0 ||
    value === 'false' ||
    value === false ||
    value == null
    ? 0
    : 1;
}

module.exports = {
  getEmployeeNumberFormat,
  editEmployeeNumberPrefix,
  editEmployeeNumberSuffix,
  getNextEmployeeNumber,
  editEmployeeNumberStatus,
};
