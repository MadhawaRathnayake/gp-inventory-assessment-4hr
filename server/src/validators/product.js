const ApiError = require("../utils/ApiError")

const isNonEmptyString = (value) => typeof value === "string" && value.trim() !== ""

const isNonNegativeInteger = (value) => Number.isInteger(value) && value >= 0

const validateCreateProduct = ({ sku, name, category, stock = 0, minStock = 0 }) => {
  if (!isNonEmptyString(sku)) throw new ApiError(400, "sku is required")
  if (!isNonEmptyString(name)) throw new ApiError(400, "name is required")
  if (!isNonEmptyString(category)) throw new ApiError(400, "category is required")
  if (!isNonNegativeInteger(stock)) {
    throw new ApiError(400, "stock must be a non-negative integer")
  }
  if (!isNonNegativeInteger(minStock)) {
    throw new ApiError(400, "minStock must be a non-negative integer")
  }

  return {
    sku: sku.trim(),
    name: name.trim(),
    category: category.trim(),
    stock,
    minStock,
  }
}

module.exports = { validateCreateProduct }