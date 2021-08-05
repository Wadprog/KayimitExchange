// Dependencies.
const express = require('express');
const transaction = require('../controllers/transaction');


const router = express.Router();

// Managing request to the different endpoints
router.route('/').get(transaction.getAll).post(transaction.add);
router.get('/new', transaction.renderForm);

module.exports = router;


