import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearSaveError, deleteProduct } from "./productsSlice"

const DeleteProductConfirm = ({ product, onDone }) => {
  const dispatch = useDispatch()
  const { saving, saveError } = useSelector((state) => state.products)

  // don't show an old error from a previous attempt
  useEffect(() => {
    dispatch(clearSaveError())
  }, [dispatch])

  const handleDelete = async () => {
    const result = await dispatch(deleteProduct(product.sku))
    if (!result.error) onDone()
  }

  return (
    <div>
      {saveError && <div className="alert alert-danger">{saveError}</div>}

      <p>
        Remove <strong>{product.name}</strong>{" "}
        (<span className="font-monospace">{product.sku}</span>)?
      </p>
      <p className="text-secondary small">
        It will no longer appear in the product list or the dashboard totals.
      </p>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={onDone} disabled={saving}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={saving}>
          {saving ? "Removing…" : "Remove product"}
        </button>
      </div>
    </div>
  )
}

export default DeleteProductConfirm