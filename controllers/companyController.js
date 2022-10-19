const { Company, Branch } = require("../models");
const {
  logInfo,
  logError,
  returnSuccess,
  returnError,
} = require("./../utils/helper");

const createCompany = async (req, res, next) => {
  try {
    const { name } = req.body;
    await Company.create({ name });

    const message = "Company created successfully";
    const returnObj = {
      message,
      payload: {},
      res,
    };
    logInfo(req, message, req.decoded.id);
    return returnSuccess(returnObj);
  } catch (error) {
    const message = error.message;
    const returnObj = {
      message,
      payload: {},
      res,
    };
    logError(req, message, req.decoded.id);

    return returnError(returnObj);
  }
};

const getAllCompanies = async (req, res, next) => {
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
      logInfo(req, message, req.decoded.id);
      const returnObj = {
        message,
        payload: {
          companys,
        },
        res,
      };
      return returnSuccess(returnObj);
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

      console.log(companys);
      const total_count = await Company.count();
      const message = " Company fetched successfully";
      logInfo(req, message, req.decoded.id);
      const returnObj = {
        message,
        payload: {
          companys,
          total_count,
          total_pages: Math.ceil(total_count / size),
        },
        res,
      };

      return returnSuccess(returnObj);
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    const returnObj = {
      message: message,
      payload: {},
      res,
    };
    return returnError(returnObj);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    const company = await req.sys_company.destroy();
    const message = "Company deleted successfully.";
    const returnObj = {
      res,
      message,
      payload: {
        company: company.id,
      },
    };
    return returnSuccess(returnObj);
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    const returnObj = {
      res,
      message: message,
      payload: {},
    };
    return returnError(returnObj);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const { name } = req.body;
    const sys_company = req.sys_company;
    sys_company.set({
      name,
    });
    await sys_company.save();

    const message = "Company updated successfully";
    logInfo(req, message, req.decoded.id);

    return returnSuccess({
      message,
      payload: {},
      res,
    });
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    return returnError({
      message: message,
      payload: {},
      res,
    });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  deleteCompany,
  updateCompany,
};
