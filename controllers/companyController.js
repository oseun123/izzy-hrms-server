const { Company, Branch } = require("../models");
const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require("./../utils/helper");
const { NODE_ENV } = process.env;

const createCompany = async (req, res, next) => {
  var log_obj = {
    action: "create_company",
    module: "preferences",
    sub_module: "company",
    payload: null,
    description: null,
    database: true,
  };
  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;
    const new_company = await Company.create({ name });
    const message = "Company created successfully";
    res_obj.message = message;
    log_obj.payload = JSON.stringify(new_company);
    logInfo(req, message, req.decoded.id, log_obj);
    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    logError(req, message, req.decoded.id, log_obj);
    returnError(res_obj);
  }
};

const getAllCompanies = async (req, res, next) => {
  var log_obj = {
    action: "get_company",
    module: "preferences",
    sub_module: "company",
    payload: null,
    description: null,
  };
  var res_obj = { res, message: "", payload: {} };
  try {
    const allcompanys = req.query.all;

    if (allcompanys === "all") {
      const companys = await Company.findAll({
        include: [
          {
            model: Branch,
            as: "branches",
          },
        ],
      });

      const message = " Company fetched successfully";
      res_obj.message = message;
      res_obj.payload = { companys };

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
        sizeAsNumber > 10 &&
        !(sizeAsNumber < 1)
      ) {
        size = sizeAsNumber;
      }

      const companys = await Company.findAll({
        include: [
          {
            model: Branch,
            as: "branches",
          },
        ],
        // group: "Company.id",
        limit: size,
        offset: page * size,
      });

      const total_count = await Company.count();
      const message = "Company fetched successfully";
      log_obj.database = false;
      logInfo(req, message, req.decoded.id, log_obj);
      res_obj.message = message;
      res_obj.payload = {
        companys,
        total_count,
        total_pages: Math.ceil(total_count / size),
      };

      return returnSuccess(res_obj);
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id, log_obj);
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";

    return returnError(res_obj);
  }
};

const deleteCompany = async (req, res, next) => {
  var log_obj = {
    action: "delete_company",
    module: "preferences",
    sub_module: "company",
    payload: null,
    description: null,
    database: true,
  };
  var res_obj = { res, message: "", payload: {} };

  try {
    const company = await req.sys_company.destroy();
    const message = "Company deleted successfully.";
    res_obj.message = message;
    res_obj.payload = {
      company: company.id,
    };
    log_obj.payload = JSON.stringify(company);
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

const updateCompany = async (req, res, next) => {
  var log_obj = {
    action: "update_company",
    module: "preferences",
    sub_module: "company",
    payload: null,
    description: null,
    database: true,
  };
  var res_obj = { res, message: "", payload: {} };
  try {
    const { name } = req.body;
    const sys_company = req.sys_company;
    sys_company.set({
      name,
    });
    const updated_company = await sys_company.save();

    const message = "Company updated successfully";
    log_obj.payload = JSON.stringify({
      from: sys_company,
      to: updated_company,
    });
    logInfo(req, message, req.decoded.id, log_obj);
    res_obj.message = message;
    returnSuccess(res_obj);
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id, log_obj);
    res_obj.message =
      NODE_ENV === "development" ? `${message}` : "Something went wrong";
    return returnError(res_obj);
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  deleteCompany,
  updateCompany,
};
