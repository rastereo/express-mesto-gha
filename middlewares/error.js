// eslint-disable-next-line max-classes-per-file
const {
  BAD_REQUEST_STATUS,
  UNAUTHORIZED_STATUS,
  FORBIDDEN_STATUS,
  NOT_FOUND_STATUS,
  CONFLIICT_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} = require('../utils/serverErrorStatusConstants');

class BadRequestError extends Error {
  constructor(err) {
    super(err);
    this.statusCode = BAD_REQUEST_STATUS;
    this.message = `Переданы некорректные данные: ${err.message}`;
  }
}

class UnauthorizedError extends Error {
  constructor(err) {
    super(err);
    this.statusCode = UNAUTHORIZED_STATUS;
    this.message = err.message;
  }
}

class ForbiddenError extends Error {
  constructor(err) {
    super(err);
    this.statusCode = FORBIDDEN_STATUS;
    this.message = err.message;
  }
}

class NotFoundError extends Error {
  constructor(err) {
    super(err);
    this.statusCode = NOT_FOUND_STATUS;
    this.message = 'Данные по запрошенному пути не найдены.';
  }
}

class ConflictError extends Error {
  constructor(err) {
    super(err);
    this.statusCode = CONFLIICT_STATUS;
    this.message = 'При регистрации указан email, который уже существует на сервере.';
  }
}

class InternalServerError extends Error {
  constructor(err) {
    super(err);
    this.statusCode = INTERNAL_SERVER_ERROR_STATUS;
    this.message = `На сервере произошла ошибка: ${err.message}`;
  }
}

const errorHandler = (err, req, res, next) => {
  let error;

  if (err.name === 'CastError' || err.name === 'ValidationError') {
    error = new BadRequestError(err);
  } else if (err.name === 'JsonWebTokenError' || err.message === 'Неправильная почта или пароль.') {
    error = new UnauthorizedError(err);
  } else if (err.message === 'Попытка удалить чужую карточку.') {
    error = new ForbiddenError(err);
  } else if (err.message === 'Not found') {
    error = new NotFoundError(err);
  } else if (err.code === 11000) {
    error = new ConflictError(err);
  } else {
    error = new InternalServerError(err);
  }

  res.status(error.statusCode).send({ message: error.message });

  next();
};

module.exports = {
  BadRequestError,
  NotFoundError,
  errorHandler,
};
