import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearSaveError, createProduct, updateProduct } from "./productsSlice"

const emptyForm = { sku: "", name: "", category: "", stock: 0, minStock: 0 }

const isWholeNumber = (value) => value !== "" && Number.isInteger(Number(value)) && Number(value) >= 0

const validateForm = (form, isEdit) => {
  if (!form.sku.trim()) return "SKU is required"
  if (!form.name.trim()) return "Name is required"
  if (!form.category.trim()) return "Category is required"
  if (!isEdit && !isWholeNumber(form.stock)) {
    return "Initial stock must be a whole number of 0 or more"
  }
  if (!isWholeNumber(form.minStock)) {
    return "Minimum stock must be a whole number of 0 or more"
  }
  return ""
}

const ProductForm = ({ product, onDone }) => {
  const isEdit = Boolean(product)
  const dispatch = useDispatch()
  const { saving, saveError } = useSelector((state) => state.products)
  const [formError, setFormError] = useState("")
  const [form, setForm] = useState(
    isEdit
      ? {
        sku: product.sku,
        name: product.name,
        category: product.category,
        minStock: product.minStock,
      }
      : emptyForm,
  )

  // don't show an old error from a previous attempt
  useEffect(() => {
    dispatch(clearSaveError())
  }, [dispatch])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const error = validateForm(form, isEdit)
    setFormError(error)
    if (error) return

    const action = isEdit
      ? updateProduct({
        sku: product.sku,
        changes: {
          sku: form.sku,
          name: form.name,
          category: form.category,
          minStock: Number(form.minStock),
        },
      })
      : createProduct({
        ...form,
        stock: Number(form.stock),
        minStock: Number(form.minStock),
      })

    const result = await dispatch(action)
    if (!result.error) onDone()
  }

  const errorMessage = formError || saveError

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="mb-3">
        <label className="form-label" htmlFor="sku">SKU</label>
        <input id="sku" name="sku" className="form-control" value={form.sku} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="name">Name</label>
        <input id="name" name="name" className="form-control" value={form.name} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="category">Category</label>
        <input id="category" name="category" className="form-control" value={form.category} onChange={handleChange} required />
      </div>
      <div className="row">
        {!isEdit && (
          <div className="col mb-3">
            <label className="form-label" htmlFor="stock">Initial stock</label>
            <input id="stock" name="stock" type="number" min="0" step="1" className="form-control" value={form.stock} onChange={handleChange} />
          </div>
        )}
        <div className="col mb-3">
          <label className="form-label" htmlFor="minStock">Minimum stock</label>
          <input id="minStock" name="minStock" type="number" min="0" step="1" className="form-control" value={form.minStock} onChange={handleChange} required />
        </div>
      </div>

      {isEdit && (
        <p className="text-secondary small">
          Current stock: {product.stock}. Use the stock adjustment form to change it.
        </p>
      )}

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={onDone} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  )
}

export default ProductForm