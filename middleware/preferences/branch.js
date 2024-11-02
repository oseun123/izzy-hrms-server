const validator = require("validator");
const { Branch, User } = require("../../models");
const { returnError, logError } = require("../../utils/helper");
const { Op } = require("sequelize");

async function validateBranch(req, res, next) {
  const { name, address, headquarters, branch_managers, company_id } = req.body;

  if (name === "") {
    return returnError({
      message: "Name is required",
      payload: {},
      res,
    });
  } else {
    if (!req.body.branch_id) {
      try {
        const is_name = await Branch.findOne({ where: { name } });
        if (is_name) {
          return returnError({
            message: "Branch already exist.",
            payload: {},
            res,
          });
        }
      } catch (error) {
        const returnObj = {
          status: "error",
          message: error.message,
          payload: {},
          res,
        };
        return returnError(returnObj);
      }
    }
  }

  if (
    Array.isArray(branch_managers) &&
    branch_managers.length === 0 &&
    !req.body.branch_id
  ) {
    return returnError({
      res,
      message: "Kindly select branch manager for this branch.",
      payload: {},
    });
  }
  if (address === "") {
    return returnError({
      message: "Address is required",
      payload: {},
      res,
    });
  }

  if (headquarters && req.body.branch_id) {
    try {
      const headquarter_branch = await Branch.findOne({
        where: {
          [Op.and]: [{ company_id: company_id }, { headquarters: true }],
        },
      });

      if (headquarter_branch) {
        return returnError({
          res,
          message: "Headquarter branch role already exist for this company.",
          payload: {},
        });
      }
    } catch (error) {
      return returnError({
        res,
        message: error.message,
        payload: {},
      });
    }
  } else if (headquarters) {
    try {
      const headquarter_branch = await Branch.findOne({
        where: {
          [Op.and]: [
            { company_id: company_id },
            { headquarters: headquarters },
          ],
        },
      });

      if (headquarter_branch) {
        return returnError({
          res,
          message: "Headquarter branch role already exist for this company.",
          payload: {},
        });
      }
    } catch (error) {
      return returnError({
        res,
        message: error.message,
        payload: {},
      });
    }
  }

  next();
}

async function validateDeleteBranch(req, res, next) {
  try {
    const branch = req.params.id;
    const sys_branch = await Branch.findOne({
      where: { id: branch },
      include: [
        {
          model: User,
          as: "users",
        },
        {
          model: User,
          as: "managers",
        },
      ],
    });

    if (sys_branch.dataValues.users.length) {
      const message = "Cannot delete branch with users associated with it.";
      logError(req, message, req.decoded.id);

      const returnObj = {
        status: "error",
        message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }
    if (sys_branch.dataValues.managers.length) {
      const message = "Cannot delete branch with managers associated with it.";
      logError(req, message, req.decoded.id);

      const returnObj = {
        status: "error",
        message,
        payload: {},
        res,
      };
      return returnError(returnObj);
    }
    req.sys_branch = sys_branch;
  } catch (error) {
    const returnObj = {
      status: "error",
      message: error.message,
      payload: {},
      res,
    };
    return returnError(returnObj);
  }
  next();
}
async function validateUpdateBranch(req, res, next) {
  try {
    const branch = req.params.id;
    const sys_branch = await Branch.findOne({
      where: { id: branch },
    });

    if (sys_branch) {
      req.sys_branch = sys_branch;
      next();
    } else {
      const message = "Invalid branch selection.";
      logError(req, message, req.decoded.id);
      return returnError({
        status: "error",
        message: message,
        payload: {},
        res,
      });
    }
  } catch (error) {
    const returnObj = {
      status: "error",
      message: error.message,
      payload: {},
      res,
    };
    return returnError(returnObj);
  }
}

module.exports = {
  validateBranch,
  validateDeleteBranch,
  validateUpdateBranch,
};
