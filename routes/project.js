var express = require('express')
//Custom dependencies
const { catchAsync } = require('../helper')
const AppError = require('../errors')
//Creating the router Object
var router = express.Router()

router.get(
  '/',
  catchAsync(async (req, res) => {
    res.render('projects/projects', {
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
    res.render('projects/project-add', {
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
    res.render('projects/project-detail', {
      customer: {},
      allCustomers: [],
      title: `CRM | All customers `,
      headerTitle: 'Customers List',
    })
  })
)

router.get(
  '/:id/edit',
  catchAsync(async (req, res) => {
    res.render('projects/project-edit', {
      customer: {},
      allCustomers: [],
      title: `CRM | All customers `,
      headerTitle: 'Customers List',
    })
  })
)
module.exports = router
