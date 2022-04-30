const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const validateUrl = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new CelebrateError('Передан невалидный URL');
  }
  return value;
};

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validateCreateMovie = celebrate({
  body: Joi.object().keys({
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    director: Joi.string().required(),
    country: Joi.string().required(),
    year: Joi.string().required(),
    duration: Joi.string().required(),
    description: Joi.string().required(),
    trailerLink: Joi.string().required().custom(validateUrl),
    image: Joi.string().required().custom(validateUrl),
    thumbnail: Joi.string().required().custom(validateUrl),
  }),
});

module.exports.validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
});

module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});
