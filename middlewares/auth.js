const jwt = require('jsonwebtoken');
const UnAuthtorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnAuthtorizedError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    if (!payload) {
      throw new UnAuthtorizedError('Проблема с токеном');
    }
  } catch (err) {
    next(new UnAuthtorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
