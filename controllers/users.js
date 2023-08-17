const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { CREATED_STATUS } = require('../utils/constants');

const { SECRET_KEY_DEV } = require('../utils/constants');

const DuplicateDataError = require('../errors/DuplicateDataError');
const InvalidDataError = require('../errors/InvalidDataError');
const AuthenticationError = require('../errors/AuthenticationError');
const NotFoundPageError = require('../errors/NotFoundPageError');

function registration(req, res, next) {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const { _id } = user;

      return res.status(CREATED_STATUS).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new DuplicateDataError(
            'Пользователь с данным электронным адресом уже зарегистрирован',
          ),
        );
      } else if (err.name === 'ValidationError') {
        next(
          new InvalidDataError(
            'При регистрации пользователя, переданы некорректные данные',
          ),
        );
      } else {
        next(err);
      }
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      const token = jwt.sign({ userId }, SECRET_KEY_DEV, {
        expiresIn: '7d',
      });

      return res.send({ _id: token });
    })
    .catch(() => {
      throw new AuthenticationError('Неверная почта или пароль');
    })
    .catch(next);
}

function getUsers(_, res, next) {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
}

function getUserById(req, res, next) {
  const { id } = req.params;

  User.findById(id)

    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundPageError('Пользователь c данным id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
}

function getUserInfo(req, res, next) {
  const { userId } = req.user;

  User.findById(userId)
    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundPageError('Пользователь c данным id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  const { userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundPageError('Пользователь c данным id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new InvalidDataError(
            'Переданы некорректные данные',
          ),
        );
      } else {
        next(err);
      }
    });
}

function updateProfile(req, res, next) {
  const { name, about } = req.body;
  const { userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundPageError('Пользователь c данным id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new InvalidDataError(
            'Переданы некорректные данные',
          ),
        );
      } else {
        next(err);
      }
    });
}

module.exports = {
  registration,
  login,
  getUsers,
  getUserById,
  getUserInfo,
  updateProfile,
  updateAvatar,
};
