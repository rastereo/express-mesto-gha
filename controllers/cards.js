const Card = require('../models/card');
const {
  BAD_REQUEST_STATUS,
  FORBIDDEN_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} = require('../utils/serverErrorStatusConstants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
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
  Card.findById(req.params.cardId)
    .orFail(() => new Error('Not found'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return Promise.reject(new Error('Попытка удалить чужую карточку'));
      }

      return Card.deleteOne(card)
        .then((deleted) => res.send({ deleted, card }));
    })
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
      } else if (err.message === 'Попытка удалить чужую карточку') {
        res
          .status(FORBIDDEN_STATUS)
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
