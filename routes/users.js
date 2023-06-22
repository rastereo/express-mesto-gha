const router = require('express').Router();
const {
  celebrate,
  Joi,
  Segments,
} = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUserById);

router.get('/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().regex(/^(https?:\/\/)(www.)?(\w[\w\.\-\_\~\:\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]{1,})(\.\w{1,})([\w\.\-\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]{1,})?/),
  }),
}), updateAvatar);

module.exports = router;
