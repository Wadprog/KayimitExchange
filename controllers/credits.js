/* eslint-disable no-restricted-syntax */
/**
 * Controller for all credit related request.
 */

// Dependencies.
const objectId = require('mongoose').Types.ObjectId

// Custom dependencies
const AppError = require('../errors')
const { catchAsync } = require('../helper')
const CreditProfile = require('../database/creditProfile')
const Customer = require('../database/customer')
const NegativeItemCategory = require('../database/negativeItemsCategory')
const helper = require('../helper')
/* Exporting to routes */

// Add new credit.
module.exports.add = catchAsync(async (req, res) => {
  console.clear()
  const { creditReport, scores, customer, ...negativeItems } = req.body
  // turn the negative items into an array
  const negItemsArray = helper.turnObjectToArray(negativeItems)
  /*
  For each negative item:
   1. Turn their bureaus list to an object.
   2. Remove remove the ones with empty names.
  */
  for (const negItem of negItemsArray) {
    if (negItem.name.trim().length) {
      negItem.name = negItem.name.trim()
      helper.turnBureausListToObject(negItem)
    } else {
      const idx = negItemsArray.findIndex((item) => item === negItem)
      negItemsArray.splice(idx, 1)
    }
  }

  // console.log({ negItemsArray })

  /**
   * Place holders for new item  or removed on profile.
   */
  let itemsAdded = []
  let itemsRemoved = []
  // Copying the customer passed in to a new reference var.
  let newCustomer = customer
  // Check if the customer has an id field; meaning it exist already in the db
  const { _id: CUSTOMER_ID } = customer
  if (!CUSTOMER_ID) {
    // If the customer did not exist in the db we create it.
    newCustomer = new Customer({
      ...customer,
    })

    await newCustomer.save()
  } else {
    // if the customer existed in the db we check for the latest previous credit reports.
    const newestAddedReport = await CreditProfile.findOne({
      customer: objectId(CUSTOMER_ID),
    })
      .sort({ dateAddedOnProfile: 'desc' })
      .limit(1)
    // If we find a previous credit report associated to the customer we check for differences.
    if (newestAddedReport) {
      ;[itemsAdded, itemsRemoved] = helper.creditDifference(
        negItemsArray,
        newestAddedReport.negativeItems
      )

      // console.log('Addeds')
      // console.log({ ...added })
      // console.log('Removeds')
      // console.log({ ...removed })
    }
  }
  // Creating the new Credit profile.
  const newCreditProfile = new CreditProfile({
    customer: newCustomer._id,
    scores,
    negativeItems: negItemsArray,
    dateAddedOnProfile: creditReport.date,
    itemsAdded,
    itemsRemoved,
  })

  // console.log({
  //   ...newCreditProfile,
  //   negItems: newCreditProfile.negativeItems,
  //   itemAdd: newCreditProfile.itemsAdded,
  //   itemDel: newCreditProfile.itemsRemoved,
  // })
  // We save the new report and redirect the user.
  await newCreditProfile.save()
  // If we created a new user we send it back to the evaluation page on gfe tab.
  if (!CUSTOMER_ID) {
    req.flash('success', 'Evaluation created successfully')
    return res.redirect(`/credits/${newCreditProfile._id}?tab=gfe`)
  }
  // If the user already existed we redirect to the user profile to the report tab.
  req.flash('success', 'New Assess created successfully')
  return res.redirect(`/customers/${customer._id}?tab=report`)
})
// Get all credits.
module.exports.getAll = catchAsync(async (req, res) => {
  const creditsProfiles = await CreditProfile.find({}).populate('customer')
  return res.send(creditsProfiles)
})
// New credit render form.
module.exports.renderForm = catchAsync(async (req, res) => {
  const negItemCats = await NegativeItemCategory.find({})
  return res.render('credits/new', { negItemCats })
})
// Get a credit base on an id.
module.exports.getOne = catchAsync(async (req, res) => {
  const creditsProfile = await CreditProfile.findById(req.params.id)
    .populate('customer')
    .populate('category')
  const negativeItems = await NegativeItemCategory.find({})

  return res.render('credits', {
    creditsProfile,
    negativeItems,
    title: `CRM | ${creditsProfile.customer.firstName} ${creditsProfile.customer.lastName}`,
    headerTitle: `Credit Details for ${creditsProfile.customer.firstName} ${creditsProfile.customer.lastName}`,
  })
})
// Add a new credit dor an existing customer.
module.exports.customerNewCredit = catchAsync(async (req, res) => {
  const { customerId } = req.params
  // Verifying the assoc customer exist
  const customer = await Customer.findById(customerId)
  if (!customer)
    throw new AppError('We could not find the specified customer', 404)
  // Gathering the data from the sender
  let { negativeItems, scores } = req.body
  negativeItems = JSON.parse(negativeItems)
  scores = JSON.parse(scores)
  const { dateAddedOnProfile } = req.body

  // Verifying that actual data were sent
  if (
    !dateAddedOnProfile ||
    !negativeItems.length ||
    !Object.keys(scores).length
  )
    throw new AppError('Please review the parameters sent', 400)
  // In case all data were sent correctly
  const itemsAdded = []
  const itemsRemoved = []
  // Getting the newest assessment
  const newestAddedReport = await CreditProfile.findOne({
    customer: objectId(customerId),
  })
    .sort({ dateAddedOnProfile: 'desc' })
    .limit(1)

  // Calculate the itemsAdded and itemsRemoved by comparing new request with the newest one saved

  if (newestAddedReport) {
  }
  // Creating a new Credit profile ans save to db
  const creditProfile = new CreditProfile({
    customer: objectId(customerId),
    negativeItems,
    scores,
    itemsAdded,
    itemsRemoved,
    dateAddedOnProfile,
  })
  await creditProfile.save()
  // Redirect the customer to the right page.
  req.flash('success', 'Credit added successfully')
  return res.redirect(`/customers/${customerId}`)
})
