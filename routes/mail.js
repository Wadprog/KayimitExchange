var express = require('express')
//Custom dependencies
const { catchAsync } = require('../helper')
const AppError = require('../errors')
//Creating the router Object
var router = express.Router()

router.get(
  '/',
  catchAsync(async (req, res) => {
    res.render('mails/mailbox', {
      customer: {},
      allCustomers: [],
      title: `CRM | All customers `,
      headerTitle: 'Customers List',
    })
  })
)

router.get(
  '/new',
  catchAsync(async (req, res) => {
    res.render('mails/compose', {
      customer: {},
      allCustomers: [],
      title: `CRM | All customers `,
      headerTitle: 'Customers List',
    })
  })
)

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    res.render('mails/read-mail', {
      customer: {},
      allCustomers: [],
      title: `CRM | All customers `,
      headerTitle: 'Customers List',
    })
  })
)
module.exports = router
