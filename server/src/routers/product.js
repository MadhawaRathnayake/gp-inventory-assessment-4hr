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

router.post("/api/products", controller.createProduct)

router.patch("/api/products/:sku", controller.updateProduct)

router.delete("/api/products/:sku", controller.deleteProduct)

router.patch("/api/products/:sku/stock", controller.adjustStock)

module.exports = router
