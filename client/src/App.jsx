import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts } from "./features/products/productsSlice"
import Modal from "./component/popup_model"
import ProductForm from "./features/products/productForm"

const App = () => {
  const [showCreate, setShowCreate] = useState(false)
  const dispatch = useDispatch()
  const {
    items: products,
    status,
    error,
  } = useSelector((state) => state.products)

  const recentAdjustments = products
    .flatMap((product) =>
      (product.stockAdjustments || []).map((adjustment) => ({
        ...adjustment,
        sku: product.sku,
        name: product.name,
      })),
    )
    .sort((a, b) => new Date(b.adjustedAt) - new Date(a.adjustedAt))
    .slice(0, 10)
  const totalProducts = products.length
  const totalStock = products.reduce(
    (sum, product) => sum + (product.stock || 0),
    0,
  )
  const lowStockCount = products.filter(
    (product) => product.stock <= product.minStock,
  ).length

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return (
    <main className="container py-4">
      <p className="text-uppercase text-secondary small mb-1">
        Gunda Power · Associate Assessment
      </p>
      <h1 className="h3 mb-2">Mini Inventory Management System</h1>
      <p className="text-secondary">
        The list and dashboard read from Redux. Add a way to add, edit, and
        remove products, plus a separate stock-adjustment form. See
        ASSESSMENT.md.
      </p>

      <section className="row g-3 mb-4">
        <div className="col-sm-4">
          <div className="card">
            <div className="card-body">
              <div className="text-secondary small">Products</div>
              <div className="fs-4">{totalProducts}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card">
            <div className="card-body">
              <div className="text-secondary small">Stock units</div>
              <div className="fs-4">{totalStock}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card">
            <div className="card-body">
              <div className="text-secondary small">Low stock</div>
              <div className="fs-4">{lowStockCount}</div>
            </div>
          </div>
        </div>
      </section>

      {status === "loading" && <p>Loading…</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      <button className="btn btn-primary mb-3" onClick={() => setShowCreate(true)}>
        Add product
      </button>

      {showCreate && (
      <Modal title="Add product" onClose={() => setShowCreate(false)}>
        <ProductForm onDone={() => setShowCreate(false)} />
        </Modal>
      )}

      {status === "succeeded" && (
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
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="font-monospace">{product.sku}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td className="text-end">{product.stock}</td>
                    <td className="text-end">{product.minStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <section className="card">
        <div className="card-body">
          <h2 className="h6">Recent stock adjustments</h2>
          {recentAdjustments.length === 0 ? (
            <p className="text-secondary mb-0">
              None yet. These appear after a stock adjustment is saved.
            </p>
          ) : (
            <ul className="mb-0">
              {recentAdjustments.map((adjustment) => (
                <li key={adjustment._id}>
                  {adjustment.sku}: {adjustment.change} ({adjustment.reason})
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
