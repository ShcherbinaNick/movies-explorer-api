const express = require('express');
const { getMyMovies, createMovie, removeMovie } = require('../controlllers/movies');
const { validateCreateMovie, validateMovieId } = require('../middlewares/validation');

const moviesRoutes = express.Router();

moviesRoutes.get('/', getMyMovies);
moviesRoutes.post('/', express.json(), validateCreateMovie, createMovie);
moviesRoutes.delete('/:movieId', validateMovieId, removeMovie);

module.exports.moviesRoutes = moviesRoutes;
