const express = require('express');

const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const {
  getAllMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movie');

const { validationCreateCard, validationCard } = require('../utils/validation');

router.get('/', getAllMovies);

router.delete('/:movieId', validationCard, deleteMovie);

router.post('/', express.json(), validationCreateCard, createMovie);

module.exports = router;
