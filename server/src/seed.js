const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../.env") })

const mongoose = require("mongoose")
const connectDatabase = require("./db/mongoose")
const Product = require("./models/product")

const products = [
  {
    sku: "INV-5K-001",
    name: "5kW Hybrid Inverter",
    category: "Solar Inverter",
    stock: 8,
    minStock: 3,
  },
  {
    sku: "BAT-48V-100",
    name: "48V Lithium Battery",
    category: "Batteries",
    stock: 3,
    minStock: 4,
  },
  {
    sku: "ELE-AC-2P-40A",
    name: "AC Isolator 2P - 40A",
    category: "Electrical Accessories",
    stock: 50,
    minStock: 5,
  },
  {
    sku: "PV-550W-001",
    name: "550W Solar Panel",
    category: "PV modules",
    stock: 24,
    minStock: 10,
  },
  {
    sku: "SOL-WP-001",
    name: "NOVA DC300 water pump",
    category: "Solar Water Pumps",
    stock: 0,
    minStock: 5,
  },
]

const seed = async () => {
  await connectDatabase()
  await Product.deleteMany({})
  await Product.insertMany(products)
  console.log(`Seeded ${products.length} products`)
  await mongoose.disconnect()
}

seed().catch(async (error) => {
  console.error(error)
  await mongoose.disconnect()
  process.exit(1)
})
