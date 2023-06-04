const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.send(err));
};

const getCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(404)
          .send({
            message: 'Card not found',
          });
      } else {
        res
          .status(500)
          .send({
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const createCard = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'Вы ввели некоректные данные' });
      } else {
        res
          .status(500)
          .send({
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => res.status(200).send(card))
    .catch((err) => res.send(err));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => res.send(err));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => res.send(err));
};

module.exports = {
  getCards,
  getCardById,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
