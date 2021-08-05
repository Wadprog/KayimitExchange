const AppError = require('../errors');
const User = require('../database/user');
const { catchAsync } = require('../helper');

module.exports.createOne = catchAsync(async (req, res) => {
  const { user } = req.body;
  console.log({ user });
  await User.register(user, user.password);
  return res.redirect('/users');
});

module.exports.getAll = catchAsync(async (req, res) => {
  const allUsers = await User.find({});
  res.render('users', {
    customer: {},
    allUsers,
    allCustomers: [],
    title: 'CRM | All customers ',
    headerTitle: 'Customers List',
  });
});
module.exports.formRender = catchAsync(async (req, res) => {
  res.render('users/new', {
    customer: {},
    allCustomers: [],
    title: 'CRM | All customers ',
    headerTitle: 'Customers List',
  });
});
module.exports.getOne = catchAsync(async (req, res) => {
  res.render('projects/project-detail', {
    customer: {},
    allCustomers: [],
    title: 'CRM | All customers ',
    headerTitle: 'Customers List',
  });
});
module.exports.editOne = catchAsync(async (req, res) => {
  res.render('projects/project-edit', {
    customer: {},
    allCustomers: [],
    title: 'CRM | All customers ',
    headerTitle: 'Customers List',
  });
});
