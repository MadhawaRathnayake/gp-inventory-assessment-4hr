const mongoose = require("mongoose")
const ApiError = require("../utils/ApiError")

const errorHandler = (error, req, res, next) => {
  if (error instanceof ApiError) {
    return res.status(error.status).send({ message: error.message })
  }

  // mongoDB specific error. Rised when a duplicate records enter to the DB
  if (error.code === 11000) {
    const [field, value] = Object.entries(error.keyValue || {})[0] || []
    const message = field ? `${field} '${value}' already exists` : "Duplicate value"
    return res.status(400).send({ message })
  }

  // mongoose schema validation
  if (error instanceof mongoose.Error.ValidationError) {
    const message = Object.values(error.errors).map((e) => e.message).join(", ")
    return res.status(400).send({ message })
  }

  // mongoose cast errors (e.g. a string where a number is expected)
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).send({ message: `Invalid value for ${error.path}` })
  }

  // malformed JSON body sent by the client
  if (error.type === "entity.parse.failed") {
    return res.status(400).send({ message: "Request body is not valid JSON" })
  }

  // unexpected errors are logged / real production servers should use propper logger.
  // Since this is a assessment and stater files had it, I'm keeping it - Madhawa
  console.error(error)
  res.status(500).send({ message: "Internal server error" })
}

module.exports = errorHandler