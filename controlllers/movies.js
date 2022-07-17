const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Movie = require('../models/movie');

module.exports.getMyMovies = async (req, res, next) => {
  try {
    const myMovies = await Movie.find({ owner: req.user._id }).populate(['owner']);
    if (!myMovies) {
      throw new NotFoundError('Нет сохранённых фильмов');
    } else {
      res.status(200).send(myMovies);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;
    const ownerId = req.user._id;
    const createdMovie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: ownerId,
    });
    if (createdMovie) {
      res.status(201).send(createdMovie);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы невалидные данные'));
    } else {
      next(err);
    }
  }
};

module.exports.removeMovie = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError('Фильма с таким id не найдено');
    }

    const movieOwner = movie.owner.valueOf();
    if (movieOwner !== userId) {
      throw new ForbiddenError('Удалять можно только свои фильмы');
    }

    const deleteMovie = await Movie.findByIdAndRemove(movieId);
    if (!deleteMovie) {
      throw new NotFoundError('Неправильный id фильма');
    }
    res.send({ message: 'Фильм удален' });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Неправильный id фильма'));
    } else {
      next(err);
    }
  }
};
