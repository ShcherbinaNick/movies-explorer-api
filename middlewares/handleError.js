module.exports.handleError = (err, req, res, next) => {
  const errorCode = err.statusCode || 500;
  const errorMessage = errorCode === 500 ? 'Ошибка сервера' : err.message;
  res.status(errorCode).send({ message: errorMessage });
  next();
};
