require("dotenv").config();
const { DB_DEV_USER, DB_DEV_PASS, DB_DEV_DB, DB_DEV_HOST, DB_DEV_DIAL } =
  process.env;
module.exports = {
  development: {
    username: DB_DEV_USER,
    password: DB_DEV_PASS,
    database: DB_DEV_DB,
    host: DB_DEV_HOST,
    dialect: DB_DEV_DIAL,
  },
  production: {
    username: "",
    password: "",
    database: "",
    host: "",
    dialect: "",
  },
};
