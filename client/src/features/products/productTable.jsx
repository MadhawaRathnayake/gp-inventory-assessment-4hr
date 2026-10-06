import { useDispatch, useSelector } from "react-redux"
import { fetchProducts, openDialog } from "./productsSlice"

const ProductTable = () => {
  const dispatch = useDispatch()
  const { items: products, status, error } = useSelector((state) => state.products)

  const open = (type, product) => dispatch(openDialog({ type, productId: product._id }))

  if (status === "idle" || status === "loading") {
    return (
      <div className="d-flex align-items-center gap-2 text-secondary mb-4">
        <div className="spinner-border spinner-border-sm" role="status" />
        Loading products…
      </div>
    )
  }

  if (status === "failed") {
    return (
      <div className="alert alert-danger d-flex justify-content-between align-items-center mb-4">
        <span>{error}</span>
        <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch(fetchProducts())}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="card mb-4">
      <div className="table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th className="text-end">Stock</th>
              <th className="text-end">Minimum Stock</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-secondary py-4">
                  No products yet. Use “Add product” to create one.
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product._id}>
                <td className="font-monospace">{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td className="text-end">
                  {product.stock <= product.minStock && (
                    <span className="badge text-bg-warning me-2">Low</span>
                  )}
                  {product.stock}
                </td>
                <td className="text-end">{product.minStock}</td>
                <td className="text-end">
                  <div className="d-inline-flex gap-2">
                    <button className="btn btn-sm btn-outline-success" onClick={() => open("adjust", product)}>
                      Adjust stock
                    </button>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => open("edit", product)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => open("delete", product)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductTable
