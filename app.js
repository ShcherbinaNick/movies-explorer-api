require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { routes } = require('./routes');
const { handleError } = require('./middlewares/handleError');
const cors = require('./middlewares/cors');

const app = express();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;

app.use(cookieParser());
app.use(cors);
app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(handleError);

async function main() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('connected to db');
    await app.listen(PORT);
    console.log(`App listening on port ${PORT}`);
  } catch (err) {
    throw new Error(`Не удалось запустить сервер: ${err}`);
  }
}

main();
