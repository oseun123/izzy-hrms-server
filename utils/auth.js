const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET, JWT_SECRET_REFRESH } = process.env;

const createToken = ({ id, first_name, last_name }, time = "10s") => {
  console.log({ id, first_name, last_name });
  return jwt.sign({ id, first_name, last_name }, JWT_SECRET, {
    expiresIn: time,
  });
};
const createRefreshToken = ({ id, first_name, last_name }) => {
  return jwt.sign({ id, first_name, last_name }, JWT_SECRET_REFRESH, {
    expiresIn: "24h",
  });
};

const verifyToken = (token) => {
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded;
};
const verifyTokenRefresh = (token) => {
  const decoded = jwt.verify(token, JWT_SECRET_REFRESH);
  return decoded;
};

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};
const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

module.exports = {
  createToken,
  verifyToken,
  hashPassword,
  comparePassword,
  createRefreshToken,
  verifyTokenRefresh,
};
