const express = require('express');
const { postCheckout } = require('../controllers/checkoutController');
const isAuth = require('../middlewares/isAuth');

const checkoutRouter = express.Router();

checkoutRouter.post('/', isAuth, postCheckout);

module.exports = checkoutRouter;
