const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET, JWT_SECRET_REFRESH } = process.env;

const createToken = (user, time = "60s") => {
  const { id, first_name, last_name } = user;

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
const getUserPermissions = (user) => {
  if (!user.roles) return [];
  const roles = user.roles;
  const permissions = [];
  roles.forEach((role) => {
    permissions.push(role.permissions);
  });
  const perms_arr = permissions.flat();
  const ids = perms_arr.map((o) => o.id);
  const filtered = perms_arr.filter(
    ({ id }, index) => !ids.includes(id, index + 1)
  );
  return filtered;
};

module.exports = {
  createToken,
  verifyToken,
  hashPassword,
  comparePassword,
  createRefreshToken,
  verifyTokenRefresh,
  getUserPermissions,
};
