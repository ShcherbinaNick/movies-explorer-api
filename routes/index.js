const express = require('express');
const { createUser, login, logout } = require('../controlllers/users');
const { moviesRoutes } = require('./movies');
const { userRoutes } = require('./users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { validateCreateUser, validateLogin } = require('../middlewares/validation');

const routes = express.Router();

routes.post('/signup', express.json(), validateCreateUser, createUser);
routes.post('/signin', express.json(), validateLogin, login);

routes.use(auth);

routes.use('/users', userRoutes);
routes.use('/movies', moviesRoutes);

routes.get('/signout', logout);

routes.use((req, res, next) => {
  next(new NotFoundError('Cтраница не найдена'));
});

module.exports.routes = routes;
