const express = require('express');
const { postLogin } = require('../controllers/loginController');

const loginRouter = express.Router();

loginRouter.post('/', postLogin);

module.exports = loginRouter;
