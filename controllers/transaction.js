// Dependencies.
const objectId = require('mongoose').Types.ObjectId;

// Custom dependencies
//const AppError = require('../errors');
const { catchAsync } = require('../helper');
// const Transaction = require('../database/transaction');
// const Customer = require('../database/customer');
// const helper = require('../helper');
/* Exporting to routes */

// Add new transaction.
module.exports.add = catchAsync(async (req, res) => {});
// Get all transactions.
module.exports.getAll = catchAsync(async (req, res) => {});

// New transaction render form.
module.exports.renderForm = catchAsync((req, res) =>
  res.render('transactionForm', {
    title: 'Index',
    headerTitle: 'Dashboard',
  })
);

// Get a transaction base on an id.
module.exports.getOne = catchAsync(async (req, res) => {});
