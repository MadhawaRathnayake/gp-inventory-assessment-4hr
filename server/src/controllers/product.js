const Product = require("../models/product")
const ApiError = require("../utils/ApiError")
const { validateCreateProduct } = require("../validators/product")

const createProduct = async (req, res, next) => {
    try {
        const data = validateCreateProduct(req.body)

        const skuTaken = await Product.exists({ sku: data.sku })
        if (skuTaken) {
            throw new ApiError(400, `A product with sku '${data.sku}' already exists`)
        }

        const product = await Product.create(data)
        res.status(201).send(product)
    } catch (error) {
        next(error)
    }
}

module.exports = {createProduct}