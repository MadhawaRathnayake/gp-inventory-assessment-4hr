const express = require("express")
const Product = require("../models/product")
const controller = require("../controllers/product")

const router = new express.Router()

// Starter list route. Hides soft-deleted products and returns a JSON array.
router.get("/api/products", async (req, res, next) => {
  try {
    const products = await Product.find({ deleted: { $ne: true } }).sort({
      sku: 1,
    })
    res.send(products)
  } catch (error) {
    next(error)
  }
})

// TODO: POST /api/products
router.post("/api/products", controller.createProduct)
// TODO: PATCH /api/products/:sku
// TODO: DELETE /api/products/:sku
// TODO: PATCH /api/products/:sku/stock

module.exports = router
