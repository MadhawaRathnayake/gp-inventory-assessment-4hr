import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearSaveError, createProduct } from "./productsSlice"

const emptyForm = { sku: "", name: "", category: "", stock: 0, minStock: 0 }

const ProductForm = ({ onDone }) => {
  const dispatch = useDispatch()
  const { saving, saveError } = useSelector((state) => state.products)
  const [form, setForm] = useState(emptyForm)

  // don't show an old error from a previous attempt
  useEffect(() => {
    dispatch(clearSaveError())
  }, [dispatch])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await dispatch(
      createProduct({
        ...form,
        stock: Number(form.stock),
        minStock: Number(form.minStock),
      }),
    )
    if (createProduct.fulfilled.match(result)) onDone()
  }

  return (
    <form onSubmit={handleSubmit}>
      {saveError && <div className="alert alert-danger">{saveError}</div>}

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
        <div className="col mb-3">
          <label className="form-label" htmlFor="stock">Initial stock</label>
          <input id="stock" name="stock" type="number" min="0" step="1" className="form-control" value={form.stock} onChange={handleChange} />
        </div>
        <div className="col mb-3">
          <label className="form-label" htmlFor="minStock">Minimum stock</label>
          <input id="minStock" name="minStock" type="number" min="0" step="1" className="form-control" value={form.minStock} onChange={handleChange} />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={onDone} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Create product"}
        </button>
      </div>
    </form>
  )
}

export default ProductForm