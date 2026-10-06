import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { adjustStock, clearSaveError } from "./productsSlice"

const emptyForm = { direction: "remove", quantity: "", reason: "" }

// Catch common mistakes before calling the API. The server validates again
// and is the final check for insufficient stock (409).
const validateForm = (form, currentStock) => {
  const quantity = Number(form.quantity)
  if (form.quantity === "" || !Number.isInteger(quantity) || quantity <= 0) {
    return "Quantity must be a whole number greater than 0"
  }
  if (form.direction === "remove" && quantity > currentStock) {
    return `Not enough stock. Only ${currentStock} available to remove`
  }
  if (!form.reason.trim()) return "Reason is required"
  return ""
}

const AdjustStockForm = ({ product, onDone }) => {
  const dispatch = useDispatch()
  const { saving, saveError } = useSelector((state) => state.products)
  const [formError, setFormError] = useState("")
  const [form, setForm] = useState(emptyForm)

  // don't show an old error from a previous attempt
  useEffect(() => {
    dispatch(clearSaveError())
  }, [dispatch])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const quantity = Number(form.quantity) || 0
  const change = form.direction === "add" ? quantity : -quantity
  const newStock = product.stock + change

  const handleSubmit = async (event) => {
    event.preventDefault()

    const error = validateForm(form, product.stock)
    setFormError(error)
    if (error) return

    const result = await dispatch(
      adjustStock({ sku: product.sku, change, reason: form.reason.trim() }),
    )
    if (!result.error) onDone()
  }

  const errorMessage = formError || saveError

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <p className="mb-3">
        <strong>{product.name}</strong>{" "}
        (<span className="font-monospace">{product.sku}</span>) · Current stock: {product.stock}
      </p>

      <div className="row">
        <div className="col mb-3">
          <label className="form-label" htmlFor="direction">Adjustment</label>
          <select id="direction" name="direction" className="form-select" value={form.direction} onChange={handleChange}>
            <option value="remove">Remove stock</option>
            <option value="add">Add stock</option>
          </select>
        </div>
        <div className="col mb-3">
          <label className="form-label" htmlFor="quantity">Quantity</label>
          <input id="quantity" name="quantity" type="number" min="1" step="1" className="form-control" value={form.quantity} onChange={handleChange} required />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="reason">Reason</label>
        <input id="reason" name="reason" className="form-control" placeholder="e.g. Customer order, Supplier delivery" value={form.reason} onChange={handleChange} required />
      </div>

      {quantity > 0 && (
        <p className={`small ${newStock < 0 ? "text-danger" : "text-secondary"}`}>
          Stock after adjustment: {newStock}
        </p>
      )}

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={onDone} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save adjustment"}
        </button>
      </div>
    </form>
  )
}

export default AdjustStockForm
