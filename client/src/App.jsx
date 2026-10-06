import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { closeDialog, fetchProducts, openDialog } from "./features/products/productsSlice"
import Modal from "./component/popup_model"
import { DashboardSummary, RecentAdjustments } from "./features/products/dashboard"
import ProductTable from "./features/products/productTable"
import ProductForm from "./features/products/productForm"
import DeleteProductConfirm from "./features/products/deleteProductConfirm"
import AdjustStockForm from "./features/products/adjustStockForm"

const App = () => {
  const dispatch = useDispatch()
  const { items: products, dialog, saving } = useSelector((state) => state.products)

  // Read the product from the store so dialogs always show the latest values
  const dialogProduct = dialog?.productId
    ? products.find((product) => product._id === dialog.productId)
    : null

  // Don't close a dialog while its request is still running
  const close = () => {
    if (!saving) dispatch(closeDialog())
  }

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return (
    <main className="container py-4">
      <p className="text-uppercase text-secondary small mb-1">
        Gunda Power · Associate Assessment
      </p>
      <h1 className="h3 mb-4">Mini Inventory Management System</h1>

      <DashboardSummary />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Products</h2>
        <button className="btn btn-primary" onClick={() => dispatch(openDialog({ type: "create" }))}>
          Add product
        </button>
      </div>

      <ProductTable />
      <RecentAdjustments />

      {dialog?.type === "create" && (
        <Modal title="Add product" onClose={close}>
          <ProductForm onDone={close} />
        </Modal>
      )}

      {dialog?.type === "edit" && dialogProduct && (
        <Modal title={`Edit ${dialogProduct.sku}`} onClose={close}>
          <ProductForm product={dialogProduct} onDone={close} />
        </Modal>
      )}

      {dialog?.type === "delete" && dialogProduct && (
        <Modal title={`Remove ${dialogProduct.sku}`} onClose={close}>
          <DeleteProductConfirm product={dialogProduct} onDone={close} />
        </Modal>
      )}

      {dialog?.type === "adjust" && dialogProduct && (
        <Modal title={`Adjust stock: ${dialogProduct.sku}`} onClose={close}>
          <AdjustStockForm product={dialogProduct} onDone={close} />
        </Modal>
      )}
    </main>
  )
}

export default App
