/**
 * Code for all credit related actions.
 */

// Dependencies.
const express = require('express')
const credit = require('../controllers/credits')

// Creating the router Object
const router = express.Router()
// Managing request to the different endpoints
router.route('/').get(credit.getAll).post(credit.add)

router.get('/new', credit.renderForm)
// Create credit for an existing customer
router.post('/customer/:customerId', credit.customerNewCredit)
// Get a credit report by the credit id
router.get('/:id', credit.getOne)

module.exports = router
