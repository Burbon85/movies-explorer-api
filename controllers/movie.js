const http2 = require('node:http2');

const Movie = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;

// Информация по всем карточкам
const getAllMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate(['owner'])
    .sort({ createdAt: -1 })
    .then((cards) => {
      res.status(OK).send(cards);
    })
    .catch(next);
};

// Создание карточки
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user,
  })
    .then((movie) => {
      movie.populate(['owner'])
        .then((moviePopulate) => res.status(CREATED).send(moviePopulate));
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Неверно заполнены поля'));
      } next(e);
    });
};

// Удаление карточки
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.cardId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Такой карточки нет');
      }
      if (`${movie.owner}` !== req.user._id) {
        throw new ForbiddenError('Нет доступа на удаление чужой карточки');
      }
      return Movie.deleteOne()
        .then(() => res.status(OK).send(movie));
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Неверно заполнены поля'));
        console.log(e);
        return;
      } next(e);
    });
};

module.exports = {
  getAllMovies, deleteMovie, createMovie,
};
