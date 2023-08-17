const { SERVER_ERROR_STATUS } = require('../utils/constants');

const errorHandler = (err, _, res, next) => {
  const statusCode = err.statusCode || SERVER_ERROR_STATUS;

  const message = statusCode === SERVER_ERROR_STATUS
    ? 'На сервере возникла ошибка'
    : err.message;

  res.status(statusCode).send({ message });

  next();
};

module.exports = errorHandler;
