const express = require('express');
const { postCheckout } = require('../controllers/checkoutController');

const checkoutRouter = express.Router();

checkoutRouter.post('/', postCheckout);

module.exports = checkoutRouter;
