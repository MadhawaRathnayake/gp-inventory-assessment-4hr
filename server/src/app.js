const express = require("express")
const cors = require("cors")
const productRouter = require("./routers/product")
const errorHandler = require("./middleware/errorHandler")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/health", (req, res) => {
  res.send({ status: "ok" })
})

app.use(productRouter)

app.use(errorHandler)

module.exports = app
