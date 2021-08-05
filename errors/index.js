const { suppressDeprecationWarnings } = require('moment')

class AppError extends Error {
  constructor(message, status) {
    super()
    this.message = message
    this.status = status
    console.log("We've been called")
  }
}

module.exports = AppError
