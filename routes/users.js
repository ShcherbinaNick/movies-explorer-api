const express = require('express');
const { getMe, updateUser } = require('../controlllers/users');
const { validateUpdateUser } = require('../middlewares/validation');

const userRoutes = express.Router();

userRoutes.get('/me', getMe);
userRoutes.patch('/me', express.json(), validateUpdateUser, updateUser);

module.exports.userRoutes = userRoutes;
