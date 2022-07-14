require('dotenv').config();

const {
  PORT = 3000,
  MONGO_URL,
  JWT_SECRET,
  NODE_ENV,
} = process.env;

module.exports = {
  PORT,
  MONGO_URL: NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/moviesdb',
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
};
