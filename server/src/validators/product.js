const ApiError = require("../utils/ApiError")

const isNonEmptyString = (value) => typeof value === "string" && value.trim() !== ""

const isNonNegativeInteger = (value) => Number.isInteger(value) && value >= 0

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value)

const assertJsonObject = (body) => {
  if (!isPlainObject(body)) {
    throw ApiError.badRequest("Request body must be a JSON object")
  }
}

const requiredString = (field, value) => {
  if (!isNonEmptyString(value)) {
    throw ApiError.badRequest(`${field} is required and must be a non-empty string`)
  }
  return value.trim()
}

const nonNegativeInteger = (field, value) => {
  if (!isNonNegativeInteger(value)) {
    throw ApiError.badRequest(`${field} must be a non-negative integer`)
  }
  return value
}

const validateCreateProduct = (body) => {
  assertJsonObject(body)

  const { sku, name, category, stock = 0, minStock = 0 } = body

  return {
    sku: requiredString("sku", sku),
    name: requiredString("name", name),
    category: requiredString("category", category),
    stock: nonNegativeInteger("stock", stock),
    minStock: nonNegativeInteger("minStock", minStock),
  }
}


const UPDATABLE_FIELDS = ["sku", "name", "category", "minStock"]

const validateUpdateProduct = (body) => {
  assertJsonObject(body)

  if ("stock" in body) {
    throw ApiError.badRequest(
      "stock cannot be updated here. Use PATCH /api/products/:sku/stock",
    )
  }

  const unknownFields = Object.keys(body).filter(
    (field) => !UPDATABLE_FIELDS.includes(field),
  )
  if (unknownFields.length > 0) {
    throw ApiError.badRequest(`These fields cannot be updated: ${unknownFields.join(", ")}`)
  }

  if (Object.keys(body).length === 0) {
    throw ApiError.badRequest(
      `Provide at least one field to update: ${UPDATABLE_FIELDS.join(", ")}`,
    )
  }

  const updates = {}

  for (const field of ["sku", "name", "category"]) {
    if (field in body) updates[field] = requiredString(field, body[field])
  }

  if ("minStock" in body) {
    updates.minStock = nonNegativeInteger("minStock", body.minStock)
  }

  return updates
}

const validateStockAdjustment = (body) => {
  assertJsonObject(body)

  const { change, reason } = body

  if (!Number.isInteger(change) || change === 0) {
    throw ApiError.badRequest("change must be a non-zero integer")
  }

  return {
    change,
    reason: requiredString("reason", reason),
  }
}

module.exports = { validateCreateProduct, validateUpdateProduct, validateStockAdjustment }