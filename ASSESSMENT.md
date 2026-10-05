# Associate Software Engineer — 4-Hour Assessment

## Mini Inventory Management System

Build a small inventory module similar to an ERP stock screen.

## Objective

Implement a working inventory app where users can manage products, adjust stock safely, and view a simple dashboard.

## Timebox

Spend about **4 hours**. Incomplete but well-structured work is acceptable.
Prefer correct business rules and clear code over UI polish.

## Required features

### 1. Product management

Support create, list, update, and delete for products.

Fields:

- `sku` (unique, required)
- `name` (required)
- `category` (required)
- `stock` (number, default 0, never negative)
- `minStock` (number, default 0, never negative)

The product model is already in the starter. Use it. Stock history is the `stockAdjustments` array (`change`, `reason`, `adjustedAt`). Deleted products must no longer appear in `GET /api/products` or the active product list.

Routes:

- `GET /api/products` — already implemented. Returns active products as a JSON array.
- `POST /api/products` — create
- `PATCH /api/products/:sku` — update `name`, `category`, `minStock`, and `sku`
- `DELETE /api/products/:sku` — set `deleted` to `true`

Rules:

- If updating the `sku`, the new `sku` must also be unique. A duplicate `sku` returns `400`
- Create may set an initial `stock`. That initial value does not need a history record
- After create, `stock` changes only through the stock-adjustment endpoint

### 2. Stock adjustment

```http
PATCH /api/products/:sku/stock
```

Body:

```json
{
  "change": -4,
  "reason": "Customer order"
}
```

Rules:

1. `change` must be a non-zero integer
2. `reason` is required
3. Positive values add stock
4. Negative values remove stock
5. Stock must never become negative
6. Push a record onto `stockAdjustments` (`change`, `reason`, `adjustedAt`)
7. Return clear status codes:
   - `200` success
   - `400` invalid input
   - `404` product not found
   - `409` insufficient stock

### 3. Dashboard

Show:

- Total products
- Total stock units
- Count of low-stock products (`stock <= minStock`)
- The 10 most recent adjustments should be sorted by adjustedAt descending.

The page already calculates these from the products in the Redux store. Keep the numbers correct after create, update, delete, and stock adjustment. A separate dashboard API route is not required.

### 4. Frontend

Build a usable React UI that includes:

- Product list table
- A way to add a product, edit a product, and remove a product
- A separate stock-adjustment form. This changes units on an existing product. It does not add or remove the product itself
- Dashboard summary
- Loading and error states

A Redux Toolkit store is already wired up. Extend `client/src/features/products/productsSlice.js`.

- `fetchProducts` loads the list. Follow that pattern for create, update, delete, and stock adjustment
- Keep products, loading, and error state in the slice
- Component state is fine for form inputs only

Visual design is secondary. Bootstrap or plain CSS is fine.

### 5. Backend quality

- REST API with Express
- Input validation
- Clear error messages
- Sensible project structure (routes / models / maybe controllers)
- Environment variables for MongoDB and port. `server/.env` and `client/.env` are included.
- Error responses use `{ "message": "..." }`, matching the starter error handler

### 6. Submission

Use **Fork → Clone → Branch → Pull Request**:

1. **Fork** this repository on GitHub.
2. **Clone** your fork.
3. **Create a branch** from `main` (for example `assessment/<your-name>`). Do not commit directly to `main`.
4. Implement the assessment on that branch.
5. **Push** the branch and open a **Pull Request** into this repository’s `main` branch.
6. Send the pull request link in your reply to the invitation email.

Full commands are in the [README](./README.md#submission).

### 7. Documentation

Update the project README with:

- Setup instructions
- API summary
- Design decisions
- Known limitations
- Approximate time spent
- AI tools used (ChatGPT, Cursor, Copilot, etc.), if any

## Optional bonuses

Only if time remains:

- JWT auth
- Automated tests for insufficient stock / duplicate SKU
- Atomic MongoDB update for concurrency
- Deployment link
- TypeScript
- Search / filter products

## Explicitly not required

- Pixel-perfect UI
- Docker / CI
- Advanced DevOps
- Multiple user roles

## Evaluation focus

We care most about:

1. Correct stock business rules
2. Working full-stack flow
3. Redux state management
4. API validation and use of the provided model
5. Code clarity and Git history
6. Honest documentation

## Starter notes

The starter already decides the structure. Fill in the missing behavior.

Included:

- Express server, CORS, JSON parsing, and a MongoDB connection from `server/.env`
- Product model with fields, `deleted`, and `stockAdjustments`
- `GET /api/products` (active products only) and a seed script
- Redux store and `fetchProducts`
- A page that renders the product table and dashboard from the store
- Axios and Bootstrap. The API base URL is `VITE_API_URL` in `client/.env`

Still yours to build:

- Create, update, and soft delete
- Stock adjustment, including the `409` check. `stock` has no database minimum, so Mongoose will not do that check for you
- UI to add a product, edit a product, and remove a product
- A separate stock-adjustment form for changing units on an existing product
- Thunks for those actions in `productsSlice`

You may change the starter structure if needed. Staying inside it is recommended so setup does not consume the assessment.
