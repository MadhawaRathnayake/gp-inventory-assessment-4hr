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

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/api/products`, product)
      return response.data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Could not create product",
      )
    }
  },
)

// TODO: updateProduct → PATCH /api/products/:sku
// TODO: deleteProduct → DELETE /api/products/:sku
// TODO: adjustStock → PATCH /api/products/:sku/stock

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: "",
    saving: false,
    saveError: "",
  },
  reducers: {
    clearSaveError: (state) => {
      state.saveError = ""
    },
  },
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
      .addCase(createProduct.pending, (state) => {
        state.saving = true
        state.saveError = ""
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.saving = false
        state.items.push(action.payload)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload
      })
  },
})

export const { clearSaveError } = productsSlice.actions
export default productsSlice.reducer
