const {
  User,
  UserSession,
  PasswordReset,
  Role,
  Permission,
  Client,
  AuditLog,
} = require('../models');
const sendEmail = require('../utils/sendEmail');
const {
  createToken,
  verifyToken,
  hashPassword,
  comparePassword,
  createRefreshToken,
  verifyTokenRefresh,
  getUserPermissions,
} = require('../utils/auth');
const {
  logInfo,
  logError,
  returnError,
  returnSuccess,
} = require('./../utils/helper');
const { resetLinkTemplate } = require('./../utils/template/authTemplate');
const { NODE_ENV, APP_NAME, APP_MAIL_FROM, APP_JWT_COOKIE } = process.env;

exports.signIn = async (req, res, next) => {
  try {
    var log_obj = {
      action: 'login',
      module: 'auth',
      sub_module: null,
      payload: null,
      description: null,
      database: true,
    };

    var res_obj = { res, message: '', payload: {} };

    const { email, password } = req.body;
    var user = await User.findOne({
      where: { email: email },
      include: {
        model: Role,
        as: 'roles',
        attributes: ['id'],
        include: {
          model: Permission,
          as: 'permissions',
          attributes: ['id', 'name', 'for', 'action', 'menu', 'url', 'module'],
        },
      },
    });

    if (user) {
      //  get last login
      var user_last_log = await AuditLog.findOne({
        where: { user_id: user.id, action: 'login', level: 'success' },
        order: [['id', 'DESC']],
      });

      if (user && comparePassword(password, user.password)) {
        const token = createToken({
          ...user.dataValues,
          last_login: user_last_log?.dataValues?.created_at,
        });
        const refreshToken = createRefreshToken(user);
        await UserSession.create({
          user_id: user.id,
          refresh_token: refreshToken,
        });

        res.cookie(APP_JWT_COOKIE, refreshToken, {
          // domain: "localhost",
          httpOnly: true,
          sameSite: 'None',
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        const permissions = getUserPermissions(user);

        const message = 'Sign in successfully';

        logInfo(req, message, user.id, log_obj);

        const payload = {
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            permissions,
          },
          token,
        };

        res_obj.message = message;

        res_obj.payload = payload;

        returnSuccess(res_obj);
      } else {
        const message = 'Invalid email/password combination';
        logError(req, message, user.id, log_obj);
        res_obj.message = message;

        returnError(res_obj);
      }
    } else {
      const message = 'Invalid email/password combination';
      // logError(req, message, "NAN", log_obj);
      res_obj.message = message;

      returnError(res_obj);
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, user, log_obj);
    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
    returnError(res_obj);
  }
};

exports.sendResetLink = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { protocol, hostname } = req;
    var log_obj = {
      action: 'reset_password',
      module: 'auth',
      sub_module: null,
      payload: null,
      description: null,
      database: true,
    };

    var res_obj = { res, message: '', payload: {} };

    var user = await User.findOne({ where: { email: email } });

    if (user === null) {
      const message = 'Email not found';
      logError(req, message, user.id, log_obj);
      res_obj.message = message;

      returnError(res_obj);
    }

    //  get last login
    var user_last_log = await AuditLog.findOne({
      where: { user_id: user.id, action: 'login', level: 'success' },
      order: [['id', 'DESC']],
    });

    const token = createToken(
      { ...user.dataValues, last_login: user_last_log?.dataValues?.created_at },
      '1h',
    );
    // save token in db
    PasswordReset.create({
      user_id: user.id,
      token,
    });
    const port = NODE_ENV === 'development' ? ':3000' : '';
    const link = `${protocol}://${hostname}${port}/reset-password/${token}`;
    const emailBody = await resetLinkTemplate(link, user);
    const sent = await sendEmail(
      email,
      `${APP_MAIL_FROM}`,
      `${APP_NAME} password reset`,
      emailBody,
    );
    if (sent) {
      const message = 'Password reset link has been sent successfully';
      logInfo(req, message, user.id, log_obj);
      res_obj.message = message;

      returnSuccess(res_obj);
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, user?.id, log_obj);
    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';
    returnError(res_obj);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    var log_obj = {
      action: 'reset_password',
      module: 'auth',
      sub_module: null,
      payload: null,
      description: null,
      database: true,
    };
    var res_obj = { res, message: '', payload: {} };
    const { password } = req.body;
    const { token } = req.params;
    const decoded = verifyToken(token);
    console.log({ decod: decoded });
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
        const message = 'Password reset successfully';
        log_obj.payload = JSON.stringify({
          password: hash,
        });
        logInfo(req, message, updatedUser.id, log_obj);

        res_obj.message = message;
        res_obj.payload = {
          token,
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
          },
        };
        returnSuccess(res_obj);
      } else {
        const message = 'Invalid Token, Kindly reset password again0';

        logError(req, message, updatedUser.id, log_obj);

        res_obj.message = message;
        returnError(res_obj);
      }
    } else {
      const message = 'Invalid Token, Kindly reset password again1';
      logError(req, message, updatedUser.id, log_obj);

      res_obj.message = message;
      returnError(res_obj);
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, updatedUser, log_obj);

    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';

    returnError(res_obj);
  }
};

exports.logout = async (req, res, next) => {
  try {
    var log_obj = {
      action: 'logout',
      module: 'auth',
      sub_module: null,
      payload: null,
      description: null,
      database: true,
    };
    var res_obj = { res, message: '', payload: {} };

    var user = await User.findOne({ where: { id: req.decoded.id } });

    await UserSession.destroy({
      where: { user_id: req.decoded.id },
    });

    if (user) {
      const message = 'Logout successfully';
      logInfo(req, message, user.id, log_obj);
      res.clearCookie(APP_JWT_COOKIE, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });

      const payload = {
        user: {
          id: user.id,
          email: user.email,
        },
      };

      res_obj.message = message;

      res_obj.payload = payload;

      returnSuccess(res_obj);
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, user.id, log_obj);

    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';

    returnError(res_obj);
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
      status: 'success',
      message: 'ok',
      payload: {
        emp: system_perm,
      },
    });
  } catch (error) {
    console.log(error.message);
    const message = error.message;

    return res.status(400).send({
      status: 'error',
      message: message,
      payload: {},
    });
  }
};
exports.refresh = async (req, res, next) => {
  try {
    const jwt = req.cookies[APP_JWT_COOKIE];
    const decoded = verifyTokenRefresh(jwt);
    // console.log(decoded);
    const session = await UserSession.findOne({
      where: { user_id: decoded.id, refresh_token: jwt },
      order: [['created_at', 'DESC']],
    });
    //  get last login

    var user_last_log = await AuditLog.findOne({
      where: { user_id: decoded.id, action: 'login', level: 'success' },
      order: [['id', 'DESC']],
    });

    if (session) {
      var new_token = createToken({
        ...decoded,
        last_login: user_last_log?.dataValues?.created_at,
      });
    }

    return res.status(200).send({
      status: 'success',
      message: 'ok',
      payload: {
        new_token,
      },
    });
  } catch (error) {
    const message = 'Invalid Session. Kindly login again.';

    return res.status(403).send({
      status: 'error',
      message: message,
      payload: {},
    });
  }
};
exports.currentClient = async (req, res, next) => {
  try {
    var log_obj = {
      action: 'client',
      module: 'auth',
      sub_module: null,
      payload: null,
      description: null,
      database: true,
    };
    var res_obj = { res, message: '', payload: {} };

    const current_cleint = await Client.findOne({
      where: { id: 1 },
    });

    if (current_cleint) {
      const message = 'Client fetched successfully';
      logInfo(req, message, null, log_obj);
      res_obj.message = message;
      res_obj.payload = {
        current_cleint,
      };

      returnSuccess(res_obj);
    } else {
      const message = 'Something went wrong';
      logError(req, message, null, log_obj);
      res_obj.message = message;
      returnError(res_obj);
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, null, log_obj);
    res_obj.message = message;
    returnError(res_obj);
  }
};

exports.updateClientSettings = async (req, res, next) => {
  var log_obj = {
    action: 'update-client',
    module: 'auth',
    sub_module: null,
    payload: null,
    description: null,
    database: true,
  };
  var res_obj = { res, message: '', payload: {} };
  try {
    const new_settings = req.body.settings;

    const current_cleint = await Client.findOne({
      where: { id: 1 },
    });

    if (current_cleint) {
      current_cleint.set({
        settings: new_settings,
      });

      const updated_client = await current_cleint.save();
      const message = 'Display setting updated successfully';
      res_obj.message = message;
      log_obj.payload = JSON.stringify({
        from: current_cleint,
        to: updated_client,
      });

      logInfo(req, message, req.decoded.id, log_obj);

      returnSuccess(res_obj);
    } else {
      const message = 'Something went wrong';
      logError(req, message, null, log_obj);
      res_obj.message = message;
      returnError(res_obj);
    }
  } catch (error) {
    const message = error.message;
    logError(req, message, null, log_obj);
    res_obj.message =
      NODE_ENV === 'development' ? `${message}` : 'Something went wrong';

    returnError(res_obj);
  }
};
