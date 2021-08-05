// Dependencies
const express = require('express')

// Custom dependencies
const customer = require('../controllers/customer')

// Creating the router Object
const router = express.Router()

// Creating a customer and seeing all of them
router.route('/').post(customer.createOne).get(customer.getAll)
// Render new customer form
router.get('/new', customer.formRender)

// By Id get edit delete
router
  .route('/:id')
  .get(customer.getOne)
  .put(customer.editOne)
  .delete(customer.deleteOne)
// set repair reason.
router.put('/:id/repairReason', customer.setRepairReason)
module.exports = router
