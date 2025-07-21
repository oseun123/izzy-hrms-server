const { User, Sequelize } = require('../models');
const { logInfo, logError } = require('./../utils/helper');
// const allUsers = async (req, res, next) => {
//   try {
//     const system_users = await User.findAll();
//     const message = "System users fetched successfully";
//     logInfo(req, message, req.decoded.id);
//     return res.status(200).send({
//       status: "success",
//       message,
//       payload: {
//         system_users,
//       },
//     });
//   } catch (error) {
//     const message = error.message;
//     logError(req, message, req.decoded.id);
//     return res.status(400).send({
//       status: "error",
//       message: message,
//       payload: {},
//     });
//   }
// };
const systemUsers = async (req, res, next) => {
  try {
    const system_users = await User.findAll({
      attributes: {
        exclude: ['password'],
        include: [
          [
            Sequelize.fn(
              'CONCAT',
              Sequelize.col('first_name'),
              ' ',
              Sequelize.col('last_name'),
            ),
            'fullname',
          ],
        ],
      },
      where: {
        record_status: 'active',
      },
    });
    const message = 'System users fetched successfully';
    logInfo(req, message, req.decoded.id);
    return res.status(200).send({
      status: 'success',
      message,
      payload: {
        system_users,
      },
    });
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded.id);
    return res.status(400).send({
      status: 'error',
      message: message,
      payload: {},
    });
  }
};

const getSystemUserById = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    // Manual validation
    const parsedId = parseInt(user_id, 10);
    if (!parsedId || parsedId <= 0) {
      throw new Error('Invalid user_id provided');
    }

    const system_user = await User.findOne({
      attributes: {
        exclude: ['password'],
        include: [
          [
            Sequelize.fn(
              'CONCAT',
              Sequelize.col('first_name'),
              ' ',
              Sequelize.col('last_name'),
            ),
            'fullname',
          ],
        ],
      },
      where: {
        id: parsedId,
        record_status: 'active',
      },
    });

    if (!system_user) {
      throw new Error('User not found or inactive');
    }

    const message = 'System user fetched successfully';
    logInfo(req, message, req.decoded?.id || null);
    return res.status(200).send({
      status: 'success',
      message,
      payload: {
        system_user,
      },
    });
  } catch (error) {
    const message = error.message;
    logError(req, message, req.decoded?.id || null);
    return res.status(400).send({
      status: 'error',
      message,
      payload: {},
    });
  }
};

module.exports = {
  systemUsers,
  getSystemUserById,
};
