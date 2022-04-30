const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictRequestError = require('../errors/ConflictRequestError');
const UnAuthtorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;

// # возвращает информацию о пользователе (email и имя)
// GET /users/me

module.exports.getMe = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const currentUser = await User.findById(_id);
    const { name, email } = currentUser;
    if (!currentUser) {
      throw new NotFoundError('Пользователя с таким id нет');
    }
    res.status(200).send({ name, email });
  } catch (err) {
    next(err);
  }
};

// # обновляет информацию о пользователе (email и имя)
// PATCH /users/me

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const checkUniqueEmail = await User.findOne({ email });
    if (!checkUniqueEmail) {
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        { new: true, runValidators: true },
      );
      if (updatedUser) {
        res.send(updatedUser);
      }
    } else {
      throw new ConflictRequestError('Пользователь с таким email уже зарегистрирован');
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы невалидные данные'));
    } else if (err.code === 11000) {
      next(new ConflictRequestError('Пользователь с таким email уже зарегистрирован'));
    } else {
      next(err);
    }
  }
};

// # создаёт пользователя с переданными в теле
// # email, password и name
// POST /signup

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, password, email } = req.body;
    if (!name && !password && !email) {
      throw new BadRequestError('Заполните все поля');
    }
    const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name, email, password: hashedPass,
    });
    if (user) {
      res.status(201).send({ message: `Спасибо за регистрацию, ${user.name}!` });
    }
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictRequestError('Пользователь с такой почтой уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы невалидные данные'));
    }
    next(err);
  }
};

// # проверяет переданные в теле почту и пароль
// # и возвращает JWT
// POST /signin

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError('Неправильные почта или пароль');
    }
    const user = await User.findUserByCredentials(email, password);
    if (user) {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).status(200).send({ message: 'Аутентификация пройдена' });
    }
  } catch (err) {
    next(new UnAuthtorizedError('Требуется авторизация'));
  }
};

// # Обратите внимание: если сохранять JWT в куках,
// # понадобится дополнительный роут POST /signout.
// # При запросе к роуту удалится JWT из куков пользователя.

module.exports.logout = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new UnAuthtorizedError('Вы должны быть залогинены, чтобы выйти');
    }
    res.clearCookie('token', {
      httpOnly: true,
    }).send({ message: 'Вы вышли из учётной записи' });
  } catch (err) {
    next(err);
  }
};
