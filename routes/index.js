const router = require('express').Router();

const userRoutes = require('./users');
const cardRoutes = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../components/NotFoundError');

router.use(auth);

router.use('/users', userRoutes);

router.use('/cards', cardRoutes);

router.use((req, res, next) => {
  next(new NotFoundError('Данные по запрошенному пути не найдены.'));
});

module.exports = router;
