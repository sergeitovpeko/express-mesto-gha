const User = require('../models/user');

const { OK_STATUS } = require('../utils/constants');
const { CREATED_STATUS } = require('../utils/constants');
const { BAD_REQ_STATUS } = require('../utils/constants');
const { NOT_FOUND_PAGE_STATUS } = require('../utils/constants');
const { SERVER_ERROR_STATUS } = require('../utils/constants');

module.exports.getUsers = (_, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(SERVER_ERROR_STATUS).send({
      message: 'Ошибка, статус ответа сервера: 500',
    }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(OK_STATUS).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQ_STATUS).send({
          message: 'При поиске пользователя были переданы некорректные данные',
        });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_PAGE_STATUS).send({
          message: 'Пользователь c данным Id не найден',
        });
      }

      return res.status(SERVER_ERROR_STATUS).send({
        message: 'Ошибка, статус ответа сервера: 500',
      });
    });
};

module.exports.createNewUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_STATUS).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQ_STATUS).send({
          message:
            'При создании пользователя были переданы некорректные данные',
        });
      } else {
        res.status(SERVER_ERROR_STATUS).send({
          message: 'Ошибка, статус ответа сервера: 500',
        });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(OK_STATUS).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_PAGE_STATUS).send({
          message: 'Данный пользователь не найден',
        });
      }

      if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map(
          (error) => error.message,
        );
        return res.status(BAD_REQ_STATUS).send({
          message:
            'При обновлении аватара были переданы некорректные данные',
          validationErrors,
        });
      }

      return res.status(SERVER_ERROR_STATUS).send({
        message: 'Ошибка, статус ответа сервера: 500',
      });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(OK_STATUS).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_PAGE_STATUS).send({
          message: 'Данный пользователь не найден',
        });
      }

      if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map(
          (error) => error.message,
        );
        return res.status(BAD_REQ_STATUS).send({
          message:
            'При обновлении профиля были переданы некорректные данные',
          validationErrors,
        });
      }

      return res.status(SERVER_ERROR_STATUS).send({
        message: 'Ошибка, статус ответа сервера: 500',
      });
    });
};
