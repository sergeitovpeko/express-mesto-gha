const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AuthenticationError = require('../errors/AuthenticationError');

const { Schema } = mongoose;
const { regexUrl } = require('../utils/constants');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => /.+@.+\..+/.test(email),
        message: 'Введите электронный адрес',
      },
    },

    password: {
      type: String,
      required: true,
      select: false,

    },

    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },

    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
    },

    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url) => regexUrl.test(url),
        message: 'Введите URL',
      },
    },
  },

  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (user) {
              return bcrypt.compare(password, user.password).then((matched) => {
                if (matched) return user;

                throw new AuthenticationError('Неверные почта или пароль');
              });
            }

            throw new AuthenticationError('Неверные почта или пароль');
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
