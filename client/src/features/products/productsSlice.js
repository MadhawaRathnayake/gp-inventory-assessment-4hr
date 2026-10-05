import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5050"

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axios.get(`${apiUrl}/api/products`)
    return response.data
  },
)

// TODO: createProduct → POST /api/products
// TODO: updateProduct → PATCH /api/products/:sku
// TODO: deleteProduct → DELETE /api/products/:sku
// TODO: adjustStock → PATCH /api/products/:sku/stock

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading"
        state.error = ""
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Could not load products"
      })
  },
})

export default productsSlice.reducer
