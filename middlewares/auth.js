const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../components/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  let payload;

  if (req.cookies.jwt) {
    const token = req.cookies.jwt;

    try {
      payload = jwt.verify(
        token,
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
    } catch (err) {
      next(new UnauthorizedError('Передан неверный токен'));
    }
  } else {
    next(new UnauthorizedError('Токен отсутствует'));
  }

  req.user = payload;

  next();
};

module.exports = auth;
