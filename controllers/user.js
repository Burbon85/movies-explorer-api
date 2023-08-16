const http2 = require('node:http2');

const bcrypt = require('bcrypt');

const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;

const SOLT_ROUNDS = 10; // соль

const { generateToken } = require('../utils/token');

// информация "обо мне"
const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(OK).send(user))
    .catch(next);
};

// Создание пользователя
const createUser = async (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    const newUser = await User.create({
      name, email, password: hash,
    });
    if (newUser) {
      res.status(CREATED).send({
        name: newUser.name,
        _id: newUser._id,
        email: newUser.email,
      });
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new BadRequestError('Неверно заполнены поля'));
      return;
    }
    if (e.code === 11000) {
      next(new ConflictError('Пользователь уже существует'));
      return;
    }
    next(e);
  }
};

// Обновление данных пользователем
const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Неверно заполнены поля'));
      } next(e);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  // console.log(process.env, req.headers);

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: generateToken({ _id: user._id }),
      });
    })
    .catch(next);
};

module.exports = {
  getUserMe, createUser, updateUser, login,
};
