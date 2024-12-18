const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET_ACCESS, JWT_SECRET_REFRESH } = process.env;
// change to back to 15m
const createToken = (user, time = "24h") => {
  const { id, first_name, last_name, last_login } = user;
  // console.log(user);
  // console.log(last_login);

  return jwt.sign(
    { id, first_name, last_name, last_login },
    JWT_SECRET_ACCESS,
    {
      expiresIn: time,
    }
  );
};
const createRefreshToken = ({ id, first_name, last_name }) => {
  return jwt.sign({ id, first_name, last_name }, JWT_SECRET_REFRESH, {
    expiresIn: "24h",
  });
};

const verifyToken = (token) => {
  const decoded = jwt.verify(token, JWT_SECRET_ACCESS);
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
