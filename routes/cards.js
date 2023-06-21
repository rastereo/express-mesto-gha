const router = require('express').Router();
const {
  celebrate,
  Joi,
  Segments,
} = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().required().regex(/^(https?:\/\/)(www.)?(\w[\w\.\-\_\~\:\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]{1,})(\.\w{1,})([\w\.\-\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]{1,})?/),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().min(24),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().min(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().min(24),
  }),
}), dislikeCard);

module.exports = router;
