const mongoose = require('mongoose')
const connect_to_DB = require('../database')
const Customer = require('../database/customer')
const customers = require('./data')

const fs = require('fs')
const path = require('path')

const fileToArray = () => {
  const data = fs.readFileSync(path.join(__dirname, './cccrList.csv'))
  const lines = data.toString().split('\n')
  const arrayToReturn = []
  lines.forEach((line, idx) => {
    if (idx !== 0) {
      let items = line.split(',')

      const [
        firstName,
        middleName,
        lastName,
        info,
        email,
        birthDate,
        socialSecurity,
        homeTelephone,
        address,
        city,
        state,
        zip,
        status,
        previousAddress,
        previousCity,
        previousState,
        previousZip,
        mobile,
        startDate,
        addedDate,
        workTelephone,
        phoneExt,
        fax,
        country,
        previousCountry,
        referredBy,
        affiliateCompany,
        assignedTo,
        memo,
        chargeBeePlanName,
        chargeBeePlanType,
        chargeBeePlanFee,
        chargeBeePlanSetupFee,
        chargeBeeSubscriptionStatus,
      ] = items

      arrayToReturn.push({
        firstName,
        middleName,
        lastName,
        info,
        email,
        birthDate,
        socialSecurity,
        homeTelephone,
        address,
        city,
        state,
        zip,
        status,
        previousAddress,
        previousCity,
        previousState,
        previousZip,
        mobile,
        startDate,
        addedDate,
        workTelephone,
        phoneExt,
        fax,
        country,
        previousCountry,
        referredBy,
        affiliateCompany,
        assignedTo,
        memo,
        chargeBeePlanName,
        chargeBeePlanType,
        chargeBeePlanFee,
        chargeBeePlanSetupFee,
        chargeBeeSubscriptionStatus,
      })
    }
  })
  return arrayToReturn
}
const seed = async () => {
  connect_to_DB()
  await Customer.deleteMany({})
  const data = fileToArray()
  await Customer.insertMany(data)
  console.log('Done seeding ')
  mongoose.connection.close()
}

seed()
