const routes = require('express').Router();
const express = require('express');

const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/NotFoundError');
const { validationUserSignup, validationUserSignin } = require('../utils/validation');
const { createUser, login } = require('../controllers/user');

const userRouter = require('./user');
const movieRouter = require('./movie');

routes.use('/users', auth, userRouter);
routes.use('/cards', auth, movieRouter);
routes.post('/signup', express.json(), validationUserSignup, createUser);
routes.post('/signin', express.json(), validationUserSignin, login);
routes.use('*', auth, (req, res, next) => {
  next(new NotFoundError('URL не существует'));
});

module.exports = routes;
