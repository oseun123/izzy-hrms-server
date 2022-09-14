const {
  User,
  UserSession,
  PasswordReset,
  Role,
  Permission,
} = require("../models");
const sendEmail = require("../utils/sendEmail");
const {
  createToken,
  verifyToken,
  hashPassword,
  comparePassword,
  createRefreshToken,
  verifyTokenRefresh,
  getUserPermissions,
} = require("../utils/auth");
const { logInfo, logError } = require("./../utils/helper");
const { resetLinkTempale } = require("./../utils/template/authTemplate");
const { NODE_ENV, APP_NAME, APP_MAIL_FROM, APP_JWT } = process.env;

exports.signUp = async (req, res, next) => {
  // console.log(req.body);
  try {
    const { first_name, last_name, email, password } = req.body;
    const hash = hashPassword(password);
    const signUpUser = await User.create({
      first_name,
      last_name,
      email,
      password: hash,
    });
    const token = createToken(signUpUser);
    const { id } = signUpUser;

    return res.status(201).send({
      status: "success",
      message: "Sign up successfully",
      payload: { token, user: { id, first_name, last_name, email } },
    });
  } catch (error) {
    //   return next(new Error(error));
    return res.status(400).send({
      status: "error",
      message:
        NODE_ENV === "development" ? error.message : "Something went wrong",
      payload: {},
    });
  }
};
exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    var user = await User.findOne({
      where: { email: email },
      include: {
        model: Role,
        as: "roles",
        attributes: ["id"],
        include: {
          model: Permission,
          as: "permissions",
          attributes: ["id", "name", "for", "action", "menu", "url", "module"],
        },
      },
    });
    // console.log(user);
    if (user && comparePassword(password, user.password)) {
      const token = createToken(user);
      const refreshToken = createRefreshToken(user);
      await UserSession.create({
        user_id: user.id,
        refresh_token: refreshToken,
      });
      const message = "Sign in successfully";
      logInfo(req, message, user.id);
      res.cookie(APP_JWT, refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      const permissions = getUserPermissions(user);

      return res.status(200).send({
        status: "success",
        message,
        payload: {
          user: {
            id: user.id,
            first_name: user.first_name,
            permissions,
          },
          token,
        },
      });
    }
    const message = "Invalid email/password combination";
    logError(req, message, user.id);
    return res.status(400).send({
      status: "error",
      message,
      payload: {},
    });
  } catch (error) {
    const message = error.message;
    logError(req, message, user);
    return res.status(400).send({
      status: "error",
      message,
      payload: {},
    });
  }
};

exports.sendResetLink = async (req, res, next) => {
  const { email } = req.body;
  const { protocol, hostname } = req;
  try {
    var user = await User.findOne({ where: { email: email } });
    if (user === null) {
      const message = "Email not found";
      logError(req, message, user.id);
      return res.status(400).send({
        status: "error",
        message,
        payload: {},
      });
    }
    const token = createToken(user, "1h");
    // save token in db
    PasswordReset.create({
      user_id: user.id,
      token,
    });
    const port = NODE_ENV === "development" ? ":3000" : "";
    const link = `${protocol}://${hostname}${port}/reset-password/${token}`;

    const sent = await sendEmail(
      email,
      `${APP_MAIL_FROM}`,
      `${APP_NAME} password reset`,
      resetLinkTempale(link)
    );
    if (sent) {
      const message = "Password reset link has been sent successfully";
      logInfo(req, message, user.id);
      return res.status(200).send({
        status: "success",
        message,
        payload: {},
      });
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, user);
    return res.status(400).send({
      status: "error",
      message,
      payload: {},
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
    const decoded = verifyToken(token);
    if (decoded) {
      const hash = hashPassword(password);
      var updatedUser = await User.findOne({ where: { id: decoded.id } });
      //find token in db
      const tokenDB = await PasswordReset.findOne({
        where: { user_id: decoded.id, token: token },
      });

      if (updatedUser && tokenDB) {
        await updatedUser.update({ password: hash });
        tokenDB.destroy();

        logInfo(req, "Password reset successfully", updatedUser.id);
        return res.status(200).send({
          status: "success",
          message: "Password reset successfully",
          payload: {
            token,
            user: {
              id: updatedUser.id,
              email: updatedUser.email,
              name: updatedUser.name,
            },
          },
        });
      } else {
        const message =
          NODE_ENV === "development"
            ? "Invalid Token, Kindly reset password again"
            : "Invalid Token, Kindly reset password again";
        logError(req, message, updatedUser);
        return res.status(400).send({
          status: "error",
          message,
          payload: {},
        });
      }
    } else {
      const message = "Invalid Token, Kindly reset password again";
      logError(req, message, updatedUser.id);
      return res.status(400).send({
        status: "error",
        message,
        payload: {},
      });
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, updatedUser);
    return res.status(400).send({
      status: "error",
      message,
      payload: {},
    });
  }
};

exports.logout = async (req, res, next) => {
  try {
    var user = await User.findOne({ where: { id: req.decoded.id } });

    await UserSession.destroy({
      where: { user_id: req.decoded.id },
    });

    if (user) {
      const message = "Logout successfully";
      logInfo(req, message, user.id);
      res.clearCookie(APP_JWT, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.status(200).send({
        status: "success",
        message,
        payload: {
          user: {
            id: user.id,
            email: user.email,
          },
        },
      });
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, user.id);
    return res.status(400).send({
      status: "error",
      message,
      payload: {},
    });
  }
};
exports.test = async (req, res, next) => {
  try {
    const system_perm = await Permission.findAll();
    console.log(system_perm);
    // const emp = [
    //   { name: "Seun", age: "26" },
    //   { name: "Bisi", age: "30" },
    //   { name: "Kemi", age: "22" },
    // ];
    return res.status(200).send({
      status: "success",
      message: "ok",
      payload: {
        emp: system_perm,
      },
    });
  } catch (error) {
    console.log(error.message);
    const message = error.message;

    return res.status(400).send({
      status: "error",
      message: message,
      payload: {},
    });
  }
};
exports.refresh = async (req, res, next) => {
  try {
    const jwt = req.cookies[APP_JWT];
    const decoded = verifyTokenRefresh(jwt);
    const session = await UserSession.findOne({
      where: { user_id: decoded.id, refresh_token: jwt },
      order: [["created_at", "DESC"]],
    });

    if (session) {
      var new_token = createToken(decoded);
    }

    return res.status(200).send({
      status: "success",
      message: "ok",
      payload: {
        new_token,
      },
    });
  } catch (error) {
    const message = "Invalid Session. Kindly login again.";

    return res.status(400).send({
      status: "error",
      message: message,
      payload: {},
    });
  }
};
