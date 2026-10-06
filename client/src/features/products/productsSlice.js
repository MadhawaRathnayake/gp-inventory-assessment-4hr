import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5050"

const productUrl = (sku) => `${apiUrl}/api/products/${encodeURIComponent(sku)}`

const toUserMessage = (err, fallback) => {
  if (!axios.isAxiosError(err)) {
    console.error(err)
    return fallback
  }

  if (!err.response) {
    return "Can't reach the server. Check your connection and try again."
  }

  const { status, data } = err.response

  if (status === 404) {
    return "This product no longer exists. Refresh the list and try again."
  }
  if (status >= 500) {
    return `${fallback}. Please try again later.`
  }
  // 400 invalid input / 409 insufficient stock
  return data?.message || fallback
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/api/products`)
      return response.data
    } catch (err) {
      return rejectWithValue(toUserMessage(err, "Could not load products"))
    }
  },
)

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/api/products`, product)
      return response.data
    } catch (err) {
      return rejectWithValue(toUserMessage(err, "Could not create product"))
    }
  },
)

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ sku, changes }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(productUrl(sku), changes)
      return response.data
    } catch (err) {
      return rejectWithValue(toUserMessage(err, "Could not update product"))
    }
  },
)

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (sku, { rejectWithValue }) => {
    try {
      const response = await axios.delete(productUrl(sku))
      return response.data
    } catch (err) {
      return rejectWithValue(toUserMessage(err, "Could not delete product"))
    }
  },
)

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
        state.error = action.payload || "Could not load products"
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
        state.saveError = action.payload || "Could not create product"
      })
      .addCase(updateProduct.pending, (state) => {
        state.saving = true
        state.saveError = ""
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.saving = false
        const index = state.items.findIndex(
          (product) => product._id === action.payload._id,
        )
        if (index !== -1) state.items[index] = action.payload
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload || "Could not update product"
      })
      .addCase(deleteProduct.pending, (state) => {
        state.saving = true
        state.saveError = ""
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.saving = false
        state.items = state.items.filter(
          (product) => product._id !== action.payload._id,
        )
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload || "Could not delete product"
      })
  },
})

export const { clearSaveError } = productsSlice.actions
export default productsSlice.reducer