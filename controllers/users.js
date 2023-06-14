const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  BAD_REQUEST_STATUS,
  UNAUTHORIZED_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} = require('../utils/serverErrorStatusConstants');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .send({
          message: `На сервере произошла ошибка: ${err.message}`,
        });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({
            message: 'Переданы некорректные данные для получения пользователя.',
          });
      } else if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_STATUS)
          .send({
            message: `Пользователь по указанному id(${req.params.userId}) не найден`,
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_STATUS)
          .send({
            message: `На сервере произошла ошибка: ${err.message}`,
          });
      }
    });
};

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      ...req.body,
      password: hash,
    }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({
            message: 'Переданы некорректные данные при создании пользователя.',
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_STATUS)
          .send({
            message: `На сервере произошла ошибка: ${err.message}`,
          });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля.',
          });
      } else if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_STATUS)
          .send({
            message: `Пользователь с указанным id(${req.user._id}) не найден.`,
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_STATUS)
          .send({
            message: `На сервере произошла ошибка: ${err.message}`,
          });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({
            message: 'Переданы некорректные данные при обновлении аватара.',
          });
      } else if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_STATUS)
          .send({
            message: `Пользователь с указанным id(${req.user._id}) не найден.`,
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_STATUS)
          .send({
            message: `На сервере произошла ошибка: ${err.message}`,
          });
      }
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res
        .status(200)
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      if (err.message === 'Неправильные почта или пароль.') {
        res
          .status(UNAUTHORIZED_STATUS)
          .send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_STATUS)
          .send({
            message: `На сервере произошла ошибка: ${err.message}`,
          });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  loginUser,
};
