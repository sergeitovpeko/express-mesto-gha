const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const routes = require('./routes/router');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());

app.disable('x-powered-by');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64afce8fd1662107bfda7b13',
  };
  next();
});

app.use(routes);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('База данных успешно подключена');
  })
  .catch(() => {
    console.log('Не удается подключиться к базе данных');
  });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
