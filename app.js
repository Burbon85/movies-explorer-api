require('dotenv').config();
const cors = require('cors');

const express = require('express');

const app = express();
const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');

const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');

const limiter = require('./middlewares/limiter'); // число запросов с одного IP в единицу времени
const serverError = require('./middlewares/serverError');

// импортируем роутеры
const routes = require('./routes');
const { createUser, login } = require('./controllers/user');

const { requestLogger, errorLogger } = require('./middlewares/logger');

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

const regex = /http[s]?:\/\/(www.)?[a-zA-Z0-9-._~:/?#'()*+,;[\]@!$&=]*#?$/;
app.use(cors());

app.use(requestLogger);

app.use(express.json());

app.use(helmet());

app.use(limiter);

app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), login);
app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);

app.use('/', routes);

app.use(errors());
app.use(errorLogger);
app.use(serverError); // централизолванная обработка ошибок

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
