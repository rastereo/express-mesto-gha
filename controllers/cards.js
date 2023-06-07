const Card = require('../models/card');
const {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} = require('../utils/serverErrorStatusConstants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .send({
          message: `На сервере произошла ошибка: ${err.message}`,
        });
    });
};

const createCard = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({
            message: 'Переданы некорректные данные при создании карточки.',
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

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({
            message: 'Переданы некорректный id для удаления карточки.',
          });
      } else if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_STATUS)
          .send({
            message: `Карточка с указанным id(${req.params.cardId}) не найдена.`,
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({
            message: 'Переданы некорректные данные для постановки лайка.',
          });
      } else if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_STATUS)
          .send({
            message: `Карточка с указанным id(${req.params.cardId}) не найдена.`,
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({
            message: 'Переданы некорректные данные для снятии лайка.',
          });
      } else if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_STATUS)
          .send({
            message: `Карточка с указанным id(${req.params.cardId}) не найдена.`,
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

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
