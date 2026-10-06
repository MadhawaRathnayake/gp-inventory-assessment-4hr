const Product = require("../models/product")
const ApiError = require("../utils/ApiError")
const { validateCreateProduct, validateUpdateProduct, validateStockAdjustment } = require("../validators/product")

const createProduct = async (req, res, next) => {
    try {
        const data = validateCreateProduct(req.body)

        const skuTaken = await Product.exists({ sku: data.sku })
        if (skuTaken) {
            throw ApiError.badRequest(`A product with sku '${data.sku}' already exists`)
        }

        const product = await Product.create(data)
        res.status(201).send(product)
    } catch (error) {
        next(error)
    }
}


const updateProduct = async (req, res, next) => {
  try {
    const updates = validateUpdateProduct(req.body)

    const product = await Product.findOne({
      sku: req.params.sku,
      deleted: { $ne: true },
    })
    if (!product) {
      throw ApiError.notFound(`Product with sku '${req.params.sku}' not found`)
    }

    if (updates.sku) {
      const skuTaken = await Product.exists({
        sku: updates.sku,
        _id: { $ne: product._id },
      })
      if (skuTaken) {
        throw ApiError.badRequest(`A product with sku '${updates.sku}' already exists`)
      }
    }

    Object.assign(product, updates)
    await product.save()

    res.send(product)
  } catch (error) {
    next(error)
  }
}


const adjustStock = async (req, res, next) => {
  try {
    const { change, reason } = validateStockAdjustment(req.body)
    const activeProduct = { sku: req.params.sku, deleted: { $ne: true } }

    const product = await Product.findOneAndUpdate(
      { ...activeProduct, stock: { $gte: -change } },
      {
        $inc: { stock: change },
        $push: { stockAdjustments: { change, reason, adjustedAt: new Date() } },
      },
      { new: true, runValidators: true },
    )

    if (product) return res.send(product)

    const existing = await Product.findOne(activeProduct).select("stock")
    if (!existing) {
      throw ApiError.notFound(`Product with sku '${req.params.sku}' not found`)
    }
    throw ApiError.insufficientStock(
      `Insufficient stock: ${existing.stock} available, cannot remove ${-change}`,
    )
  } catch (error) {
    next(error)
  }
}


const deleteProduct = async (req, res, next) => {
  try {
    // Soft delete: only active products can be deleted
    const product = await Product.findOneAndUpdate(
      { sku: req.params.sku, deleted: { $ne: true } },
      { deleted: true },
      { new: true },
    )
    if (!product) {
      throw ApiError.notFound(`Product with sku '${req.params.sku}' not found`)
    }

    res.send(product)
  } catch (error) {
    next(error)
  }
}

module.exports = { createProduct, updateProduct, adjustStock, deleteProduct }