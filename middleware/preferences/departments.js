const validator = require("validator");
const { Department } = require("../../models");

async function validateDepartment(req, res, next) {
  const { name } = req.body;

  if (name === "") {
    return res.status(400).send({
      status: "error",
      message: "Name is required",
      payload: {},
    });
  } else {
    try {
      const is_name = await Department.findOne({ where: { name } });
      if (is_name) {
        return res.status(400).send({
          status: "error",
          message: "Department name already exist.",
          payload: {},
        });
      }
    } catch (error) {
      return res.status(400).send({
        status: "error",
        message: error.message,
        payload: {},
      });
    }
  }

  next();
}

module.exports = {
  validateDepartment,
};
