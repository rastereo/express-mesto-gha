const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const UnauthorizedError = require('../components/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      // eslint-disable-next-line no-useless-escape
      validator: (v) => /^(https?:\/\/)(www.)?(\w[\w\.\-\_\~\:\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]{1,})(\.\w{1,})([\w\.\-\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]{1,})?/gmi.test(v),
      message: 'Неправильный формат ссылки',
    },
  },
  email: {
    type: String,
    requireed: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильная почта или пароль.'));
      }

      return bcrypt.compare(String(password), user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильная почта или пароль.'));
          }

          return user;
        });
    });
};

// eslint-disable-next-line func-names
userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;

  return user;
};

module.exports = mongoose.model('user', userSchema);
