/**
 * Functions for the negative Items Categories route
 */

// Dependencies
const AppError = require('../errors')
const { catchAsync } = require('../helper')
const NegativeItemCategory = require('../database/negativeItemsCategory')

module.exports.getAll = catchAsync(async (req, res) => {
  const negativeItemCategories = await NegativeItemCategory.find({})
  return res.render('negativeItems/negativeItems', {
    negativeItemCategories,
    title: 'CRM | Negative Item Categories ',
    headerTitle: 'Negative Items Categories',
  })
})

module.exports.createOne = catchAsync(async (req, res) => {
  const { negativeItem } = req.body
  const newCategory = new NegativeItemCategory({
    ...negativeItem,
  })
  await newCategory.save()
  req.flash('success', `Successfully created category for ${newCategory.name}`)
  res.redirect('/negativeItemsCategories')
})

module.exports.newOneForm = catchAsync(async (req, res) => {
  res.render('negativeItems/newCategory', {
    negItem: {},
    allCustomers: [],
    title: 'CRM | Negative items Category ',
    headerTitle: 'Create a new negative item category',
  })
})

module.exports.editOneForm = catchAsync(async (req, res) => {
  const negItem = await NegativeItemCategory.findById(req.params.id)
  if (!negItem) throw new AppError('We could not find the category you are ', '404')
  res.render('negativeItems/newCategory', {
    negItem,
    title: 'CRM | Updating Negative item Category',
    headerTitle: `Updating ${negItem.name}`,
  })
})
module.exports.editOne = catchAsync(async (req, res) => {
  const negItem = await NegativeItemCategory.findByIdAndUpdate(req.params.id, {
    ...req.body.negativeItem,
  })
  if (!negItem) {
    throw new AppError(
      'We could not find the negative item category you are trying to update',
      '404'
    )
  }
  await negItem.save()
  req.flash('success', `Successfully Updated data for ${negItem.name}`)
  res.redirect('/negativeItemsCategories')
})

module.exports.viewOne = catchAsync(async (req, res) => {
  res.render('projects/project-detail', {
    customer: {},
    allCustomers: [],
    title: 'CRM | All customers ',
    headerTitle: 'Customers List',
  })
})
