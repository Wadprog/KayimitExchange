const mongoose = require('mongoose')
const connect_to_DB = require('../database')
const Customer = require('../database/customer')

const getAllCustomers = async () => {
  connect_to_DB()
  const customers = await Customer.find({})
  console.table(customers)
  mongoose.connection.close()
}

getAllCustomers()
