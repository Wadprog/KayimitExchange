// Custom dependencies
const Customer = require('../database/customer');
const { catchAsync } = require('../helper');
const AppError = require('../errors');
const CreditProfile = require('../database/creditProfile');
const Log = require('../database/log');

const NegativeItemCategory = require('../database/negativeItemsCategory');
const helper = require('../helper');

// Add a new customer to the Database.
module.exports.createOne = catchAsync(async (req, res) => {
  const customer = new Customer({ ...req.body.customer });
  await customer.save();

  const user = req.user._id;
  const log = new Log({
    user,
    customer: customer._id,
    text: 'Created',
    type: 'new',
  });
  await log.save();

  req.flash('success', 'Success fully created customer');
  return res.redirect('/customers/');
});

// Return all the customers currently in the database
module.exports.getAll = catchAsync(async (req, res) => {
  const allCustomers = await Customer.find({});

  res.render('customers/customers', {
    customer: {},
    allCustomers,
    title: 'CRM | All customers ',
    headerTitle: 'Customers List',
  });
});
// Render the HTml Form to create new customers
module.exports.formRender = catchAsync(async (req, res) =>
  res.render('customers/new', {
    customer: {},
    title: 'CRM | Adding new customer',
    headerTitle: 'Adding a new customer',
  })
);
// Return a customer details based on a specified id
module.exports.getOne = catchAsync(async (req, res) => {
  const customer = await Customer.findById(req.params.id).populate(
    'CreditProfile'
  );

  if (!customer) throw new AppError('Could not find customer ', 404);

  const creditsProfiles = await CreditProfile.find({
    customer: req.params.id,
  });
  const negativeItems = await NegativeItemCategory.find({});
  const logs = await Log.find({ customer: customer.id });
  return res.render('customers/profile', {
    customer,
    creditsProfiles: creditsProfiles.sort(
      (a, b) => new Date(a.dateAddedOnProfile) - new Date(b.dateAddedOnProfile)
    ),
    negativeItems,
    negItemCats: negativeItems,
    logs,
    CreditRowMaker: helper.createCreditRows,
    title: `CRM | ${customer.fullName}`,
    headerTitle: 'Profile page',
  });
});
// Edit a customer's details based on an id
module.exports.editOne = catchAsync(async (req, res) => {
  const { customer } = req.body;
  await Customer.findByIdAndUpdate(req.params.id, { ...customer });
  req.flash('success', {
    type: 'success',
    msg: 'Success fully Updated customer',
  });
  return res.redirect('/customers/');
  // const customer = await Customer.findByIdAndDelete(req.params.id)
  // if (!customer) console.error('Could not find customer ', 400)
  // return res.redirect('/customers')
});
// Delete a customer base on a given id
module.exports.deleteOne = catchAsync(async (req, res) => {
  // Deleting
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) throw new AppError('Could not find customer ', 400);
  req.flash('success', {
    type: 'danger',
    msg: 'Success fully deleted customer',
  });
  return res.redirect('/customers');
});

// Modified or set a repair reason for a customer
module.exports.setRepairReason = catchAsync(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  customer.repairReason = req.body.repairReason;
  await customer.save();

  return res.redirect(`/customers/${req.params.id}`);
});
