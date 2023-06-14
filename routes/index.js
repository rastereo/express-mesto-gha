const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { NOT_FOUND_STATUS } = require('../utils/serverErrorStatusConstants');

router.use('/users', userRoutes);

router.use('/cards', cardRoutes);

router.use((req, res) => {
  res.status(NOT_FOUND_STATUS).send({
    message: 'Данные по запрошенному пути не найдены.',
  });
});

module.exports = router;
