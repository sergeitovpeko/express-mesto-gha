const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { PORT } = require('./utils/constants');
const limiter = require('./middlewares/rateLimiter');
const routeSignup = require('./routes/signup');
const routeSignin = require('./routes/signin');
const auth = require('./middlewares/auth');
const NotFoundPageError = require('./errors/NotFoundPageError');
const errorHandler = require('./middlewares/errorHandler');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

const URL = 'mongodb://127.0.0.1:27017/mestodb';

mongoose.set('strictQuery', true);

mongoose
  .connect(URL)
  .then(() => {
    console.log('БД успешно подключена');
  })
  .catch(() => {
    console.log('Не удалось подключиться к БД, проверьте правильность подключения');
  });

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(limiter);

app.use('/', routeSignup);
app.use('/', routeSignin);

app.use(auth);

app.use('/users', routeUsers);
app.use('/cards', routeCards);

app.use((req, res, next) => next(new NotFoundPageError('Запрашиваемый ресурс не найден.')));
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
