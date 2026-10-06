import { useSelector } from "react-redux"

const SummaryCard = ({ label, value }) => (
  <div className="col-sm-4">
    <div className="card">
      <div className="card-body">
        <div className="text-secondary small">{label}</div>
        <div className="fs-4">{value}</div>
      </div>
    </div>
  </div>
)

export const DashboardSummary = () => {
  const products = useSelector((state) => state.products.items)

  const totalProducts = products.length
  const totalStock = products.reduce(
    (sum, product) => sum + (product.stock || 0),
    0,
  )
  const lowStockCount = products.filter(
    (product) => product.stock <= product.minStock,
  ).length

  return (
    <section className="row g-3 mb-4">
      <SummaryCard label="Products" value={totalProducts} />
      <SummaryCard label="Stock units" value={totalStock} />
      <SummaryCard label="Low stock" value={lowStockCount} />
    </section>
  )
}

export const RecentAdjustments = () => {
  const products = useSelector((state) => state.products.items)

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

  return (
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
                <span className="font-monospace">{adjustment.sku}</span>:{" "}
                {adjustment.change > 0 ? `+${adjustment.change}` : adjustment.change}{" "}
                ({adjustment.reason}){" "}
                <span className="text-secondary small">
                  {new Date(adjustment.adjustedAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
