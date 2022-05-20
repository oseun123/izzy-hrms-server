const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;
// const { User } = models;

exports.authorizeMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({
      status: "error",
      message: "Unauthorized",
      payload: {},
    });
  } else {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          status: "error",
          message: "Unauthorized",
          payload: {},
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
};
