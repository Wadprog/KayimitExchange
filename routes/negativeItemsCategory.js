/**
 * handling all requests for the negativeItemsCategory
 */

// Dependencies
const express = require('express')
const NegativeItemCategory = require('../controllers/negativeItemsCategory')

// Creating the router Object
const router = express.Router()

router
  .route('/')
  .post(NegativeItemCategory.createOne)
  .get(NegativeItemCategory.getAll)

router.get('/new', NegativeItemCategory.newOneForm)
router.get('/:id/edit', NegativeItemCategory.editOneForm)
router
  .route('/:id')
  .put(NegativeItemCategory.editOne)
  .get(NegativeItemCategory.viewOne)

module.exports = router
