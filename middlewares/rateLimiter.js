const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  max: 120,
  windowMS: 70000,
  message: 'Превышено количество запросов на сервер. Повторите запрос позже',
});

module.exports = limiter;
