class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }

  // 400: invalid input (bad fields, duplicate sku, wrong body shape)
  static badRequest(message) {
    return new ApiError(400, message)
  }

  // 404: product not found (or soft-deleted)
  static notFound(message) {
    return new ApiError(404, message)
  }

  // 409: stock adjustment would make stock negative
  static insufficientStock(message) {
    return new ApiError(409, message)
  }
}

module.exports = ApiError