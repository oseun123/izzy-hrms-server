const { User, Branch, Company } = require("../models");
const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require("./../utils/helper");
const { NODE_ENV } = process.env;

const createBranch = async (req, res, next) => {
  var log_obj = {
    action: "create_branch",
    module: "preferences",
    sub_module: "branch",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const {
      name,
      email,
      address,
      phone_1,
      phone_2,
      code,
      headquarters,
      company_id,
      branch_managers,
    } = req.body;
    let new_branch = await Branch.create({
      name,
      email,
      address,
      phone_1,
      phone_2,
      code,
      headquarters,
      company_id,
    });
    if (branch_managers.length) {
      await new_branch.setManagers(branch_managers);
    }
    const message = "Branch created successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify(new_branch);
    log_obj.description = JSON.stringify({ branch_managers });
    logInfo(req, message, req.decoded.id, log_obj);

    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id, log_obj);
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    returnError(res_obj);
  }
};

const getAllBranches = async (req, res, next) => {
  var log_obj = {
    action: "get_branch",
    module: "preferences",
    sub_module: "branch",
    payload: null,
    description: null,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const allbranchs = req.query.all;

    if (allbranchs === "all") {
      const branchs = await Branch.findAll({
        include: [
          {
            model: Company,
            as: "company",
          },
          {
            model: User,
            as: "managers",
            attributes: { exclude: ["password"] },
          },
          {
            model: User,
            as: "users",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      const message = "Branch fetched successfully";
      res_obj.message = message;
      res_obj.payload = {
        branchs,
      };
      logInfo(req, message, req.decoded.id, log_obj);
      returnSuccess(res_obj);
    } else {
      const pageAsNumber = Number.parseInt(req.query.page);
      const sizeAsNumber = Number.parseInt(req.query.size);

      let page = 0;
      if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber - 1;
      }

      let size = 10;
      if (
        !Number.isNaN(sizeAsNumber) &&
        !(sizeAsNumber > 10) &&
        !(sizeAsNumber < 1)
      ) {
        size = sizeAsNumber;
      }

      const branchs = await Branch.findAll({
        include: [
          {
            model: Company,
            as: "company",
          },
          {
            model: User,
            as: "managers",
            attributes: { exclude: ["password"] },
          },
          {
            model: User,
            as: "users",
            attributes: { exclude: ["password"] },
          },
        ],
        // group: "Company.id",
        limit: size,
        offset: page * size,
      });

      const total_count = await Branch.count();
      const message = " Branch fetched successfully";
      res_obj.message = message;
      res_obj.payload = {
        branchs,
        total_count,
        total_pages: Math.ceil(total_count / size),
      };
      logInfo(req, message, req.decoded.id, log_obj);
      returnSuccess(res_obj);
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id, log_obj);
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    return returnError(res_obj);
  }
};

const deleteBranch = async (req, res, next) => {
  var log_obj = {
    action: "delete_branch",
    module: "preferences",
    sub_module: "branch",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const branch = await req.sys_branch.destroy();
    const message = "Branch deleted successfully.";
    res_obj.message = message;
    res_obj.payload = {
      branch: branch.id,
    };
    log_obj.payload = JSON.stringify(branch);
    logInfo(req, message, req.decoded.id, log_obj);
    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id, log_obj);
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    returnError(res_obj);
  }
};

const updateBranch = async (req, res, next) => {
  var log_obj = {
    action: "update_branch",
    module: "preferences",
    sub_module: "branch",
    payload: null,
    description: null,
    database: true,
  };

  var res_obj = { res, message: "", payload: {} };
  try {
    const {
      name,
      email,
      address,
      phone_1,
      phone_2,
      code,
      headquarters,
      company_id,
      branch_managers,
    } = req.body;
    const sys_branch = req.sys_branch;
    sys_branch.set({
      name,
      email,
      address,
      phone_1,
      phone_2,
      code,
      headquarters,
      company_id,
    });
    const updated_branch = await sys_branch.save();

    if (branch_managers) {
      await sys_branch.setManagers([]);
      await sys_branch.setManagers(branch_managers);
    }

    const message = "Branch updated successfully";
    log_obj.payload = JSON.stringify({
      from: sys_branch,
      to: updated_branch,
    });
    log_obj.description = JSON.stringify({ branch_managers });
    logInfo(req, message, req.decoded.id, log_obj);
    res_obj.message = message;
    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id, log_obj);
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    returnError(res_obj);
  }
};

module.exports = {
  createBranch,
  getAllBranches,
  deleteBranch,
  updateBranch,
};
