const express = require('express');
const { postRegister, getRegister } = require('../controllers/registerController');

const registerRouter = express.Router();

registerRouter.get('/', getRegister);

registerRouter.post('/', postRegister);

module.exports = registerRouter;
