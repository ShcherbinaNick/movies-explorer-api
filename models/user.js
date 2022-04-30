const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnAuthtorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    throw new UnAuthtorizedError('Неправильные почта или пароль');
  }
  const isPassMatched = await bcrypt.compare(password, user.password);
  if (!isPassMatched) {
    throw new UnAuthtorizedError('Неправильные почта или пароль');
  }
  return user;
};

module.exports = mongoose.model('user', userSchema);
