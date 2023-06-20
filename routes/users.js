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

router.get('/me', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().alphanum().min(24),
  }),
}), getUserById);

router.get('/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().alphanum().min(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).xor('name', 'about'),
}), updateUser);

router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateAvatar);

module.exports = router;
