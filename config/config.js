require("dotenv").config();

const {
  DB_DEV_USER,
  DB_DEV_PASS,
  DB_DEV_DB,
  DB_DEV_HOST,
  DB_DEV_DIAL,
  DB_PROD_HOST,
  DB_PROD_USER,
  DB_PROD_DB,
  DB_PROD_PASS,
} = process.env;
module.exports = {
  development: {
    username: DB_DEV_USER,
    password: DB_DEV_PASS,
    database: DB_DEV_DB,
    host: DB_DEV_HOST,
    dialect: DB_DEV_DIAL,
  },
  production: {
    username: DB_PROD_USER,
    password: DB_PROD_PASS,
    database: DB_PROD_DB,
    host: DB_PROD_HOST,
    dialect: DB_DEV_DIAL,
  },
};
