const validator = require('validator');
const { Company, Branch } = require('../../models');
const { returnError, logError } = require('../../utils/helper');

async function validateCompany(req, res, next) {
  const { name } = req.body;

  if (name === '') {
    const returnObj = {
      status: 'error',
      message: 'Name is required',
      payload: {},
      res,
    };
    return returnError(returnObj);
  } else {
    try {
      const is_name = await Company.findOne({ where: { name } });
      if (is_name) {
        const returnObj = {
          status: 'error',
          message: 'Company already exist.',
          payload: {},
          res,
        };
        return returnError(returnObj);
      }
    } catch (error) {
      const returnObj = {
        status: 'error',
        message: error.message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }
  }

  next();
}
async function validateDeleteCompany(req, res, next) {
  try {
    const company = req.params.id;
    const sys_company = await Company.findOne({
      where: { id: company },
      include: [
        {
          model: Branch,
          as: 'branches',
        },
      ],
    });

    if (!sys_company) {
      const message = 'Invalid company';
      logError(req, message, req.decoded.id);

      const returnObj = {
        status: 'error',
        message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }

    if (sys_company && sys_company.dataValues.id === 1) {
      const message = 'Cannot delete this company.';
      logError(req, message, req.decoded.id);

      const returnObj = {
        status: 'error',
        message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }

    if (sys_company.dataValues.branches.length) {
      const message = 'Cannot delete company with branches associated with it.';
      logError(req, message, req.decoded.id);

      const returnObj = {
        status: 'error',
        message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }
    req.sys_company = sys_company;
  } catch (error) {
    const returnObj = {
      status: 'error',
      message: error.message,
      payload: {},
      res,
    };
    return returnError(returnObj);
  }
  next();
}
async function validateUpdateCompany(req, res, next) {
  try {
    const company = req.params.id;
    const sys_company = await Company.findOne({
      where: { id: company },
    });

    if (sys_company) {
      req.sys_company = sys_company;
      next();
    } else {
      const message = 'Invalid company selection.';
      logError(req, message, req.decoded.id);
      return returnError({
        status: 'error',
        message: message,
        payload: {},
        res,
      });
    }
  } catch (error) {
    const returnObj = {
      status: 'error',
      message: error.message,
      payload: {},
      res,
    };
    return returnError(returnObj);
  }
}

module.exports = {
  validateCompany,
  validateDeleteCompany,
  validateUpdateCompany,
};
