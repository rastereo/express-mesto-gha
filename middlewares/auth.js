const jwt = require('jsonwebtoken');

const {
  UNAUTHORIZED_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} = require('../utils/serverErrorStatusConstants');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      res
        .status(UNAUTHORIZED_STATUS)
        .send({ message: 'Необходима авторизация.' });
    } else {
      res
        .status(INTERNAL_SERVER_ERROR_STATUS)
        .send({
          message: `На сервере произошла ошибка: ${err.message}`,
        });
    }

    next(err);
  }

  req.user = payload;

  next();
};

module.exports = auth;
