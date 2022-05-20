const { User } = require("../models");
const validator = require("validator");

exports.authMiddleware = async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body;

  if (!email) {
    return res.status(400).send({
      status: "error",
      message: "email is required",
      payload: {},
    });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).send({
      status: "error",
      message: "invalid email address",
      payload: {},
    });
  }
  if (!first_name) {
    return res.status(400).send({
      status: "error",
      message: "first name is required",
      payload: {},
    });
  }
  if (!last_name) {
    return res.status(400).send({
      status: "error",
      message: "Last is required",
      payload: {},
    });
  }
  if (!password) {
    return res.status(400).send({
      status: "error",
      message: "password is required",
      payload: {},
    });
  }
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (user) {
    return res.status(400).send({
      status: "error",
      message: "User already exsist",
      payload: {},
    });
  }
  next();
};
