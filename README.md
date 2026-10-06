# Gunda Power — Mini Inventory Management System

A MERN inventory module built on the 4-hour assessment starter: product create / list / update / soft delete, stock adjustments with history, and a dashboard. Task details are in **[ASSESSMENT.md](./ASSESSMENT.md)**.



## Setup

1. Make sure MongoDB is reachable at `MONGODB_URL` in `server/.env`.
   - `PORT` (API port, default `5050`) is in the same file.
   - The client reads `VITE_API_URL` from `client/.env`.
2. Install, seed and run:

   ```bash
   npm run install:all
   npm run seed      # optional: resets the products collection with 5 sample products
   npm run dev
   ```

3. Open:
   - Client: http://localhost:5173
   - API: http://localhost:5050 (health check: `GET /health`)

## API summary

All errors return `{ "message": "..." }`.

| Method | Route | Body | Success | Errors |
|---|---|---|---|---|
| GET | `/api/products` | – | `200` active products (sorted by SKU) | – |
| POST | `/api/products` | `{ sku, name, category, stock?, minStock? }` | `201` created product | `400` invalid input / duplicate SKU |
| PATCH | `/api/products/:sku` | any of `{ sku, name, category, minStock }` | `200` updated product | `400` invalid input / duplicate SKU / `stock` or unknown field sent, `404` not found |
| DELETE | `/api/products/:sku` | – | `200` product with `deleted: true` | `404` not found |
| PATCH | `/api/products/:sku/stock` | `{ change, reason }` | `200` updated product | `400` invalid input, `404` not found, `409` insufficient stock |

Validation rules:

- `sku`, `name`, `category`: required, non-empty strings (trimmed)
- `stock`, `minStock`: non-negative integers (both default to `0` on create)
- `change`: non-zero integer (positive adds, negative removes)
- `reason`: required, non-empty string
- Body must be a JSON object; malformed JSON returns `400`

## Design decisions

### Backend

- **Structure:** `routers` → `controllers` → `validators`, plus `utils/ApiError.js` and `middleware/errorHandler.js`.
- **Central error handling:**
  - Controllers throw `ApiError` (`badRequest` / `notFound` / `insufficientStock`).
  - One error handler maps these, plus Mongo duplicate-key, Mongoose validation/cast and bad JSON errors, to `{ message }`.
  - Unexpected errors return `500` and are logged.
- **Status codes follow the spec:**
  - Duplicate SKU returns `400` (not `409`).
  - `409` is used only for insufficient stock.
- **Stock and product details are separate:**
  - `PATCH /api/products/:sku` rejects `stock` and unknown fields.
  - Stock changes only through `PATCH /api/products/:sku/stock`.
  - Initial `stock` on create has no history record, as the spec allows.
- **Atomic stock adjustment:**
  - One `findOneAndUpdate` with the filter `stock >= -change` does `$inc` on stock and `$push` of the history record (`change`, `reason`, `adjustedAt`).
  - Two requests at the same time can't push stock below `0`.
  - If nothing matches, a follow-up lookup decides between `404` and `409`.
- **Soft delete:**
  - Delete sets `deleted: true` atomically.
  - Deleted products return `404` on update, delete and stock adjustment, and are hidden from the list.
- **Duplicate SKU:** checked in the controller for a clear message. The unique index still catches races (also returned as `400`).

### Frontend

- **Thunks:** `createProduct`, `updateProduct`, `deleteProduct` and `adjustStock` follow the `fetchProducts` pattern in `productsSlice.js`.
- **State in the slice:**
  - `items`, `status`, `error` for the list.
  - `saving`, `saveError` for write actions.
  - `dialog` for which modal is open.
- **Component state** is used only for form inputs and form-level validation messages.
- **The store updates from API responses**, with no extra refetch. The dashboard totals and the "Recent stock adjustments" list (10 most recent, `adjustedAt` descending) are calculated from the store, so they update after every create, update, delete or adjustment.
- **Error messages:** `toUserMessage` maps API errors to user messages:
  - `400` / `409`: the server message is shown.
  - `404`: "product no longer exists".
  - Network and `5xx` errors: a generic message.
  - Code bugs are logged to the console, not shown as network errors.
- **Client-side validation** before submitting gives quick feedback. The server is still the final check (for example, the `409` when stock changed in the meantime).
- **Stock adjustment form:**
  - Separate from the edit form.
  - Add / Remove + quantity + reason, converted to a signed `change`.
  - Shows a preview of the resulting stock.
- **Delete** asks for confirmation in a modal.
- **Table:** low-stock rows (`stock <= minStock`) show a "Low" badge.
- **UI states:** loading spinner, error alert with Retry, and an empty-list message.

## Known limitations

- **A deleted product's SKU can't be reused.** The uniqueness check and the unique index include soft-deleted products. This keeps the history tied to one SKU.
- **Recent adjustments come from the products in the store:**
  - Adjustments of a deleted product disappear from that list.
  - The full history is sent with every product in `GET /api/products`, which won't scale. A separate adjustments collection or endpoint would fix this.
- **Input limits:** no length limits or allowed-value list for `reason`, `name` or `category`.
- **Missing features:** no pagination, search or filtering.
- **Optional bonuses not done:** authentication, automated tests, TypeScript, deployment. The atomic stock update was done.
- **Single error message:** only the first validation error is returned, not a per-field list.

## Time spent

- Approximately **4 hours and 30 minutes**

## AI tools used

- **Claude Code (Opus 5.5):** used for
  - reviewing and improving API error handling and status codes
  - fill the gaps in my implementation of the UI
  - refactoring the frontend (dialog state in the slice, table/dashboard components, loading and error states)
  - creating initital documentation based on my git history - then I have added my inputs also.
  - **I did not vibe code the application - instead I asked for instructions and only generated small managable chunks of codes that I can review to reduce the time I spent.**