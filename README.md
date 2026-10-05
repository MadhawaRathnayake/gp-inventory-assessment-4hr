# Gunda Power — 4-Hour Inventory Assessment

Take-home / follow-up assessment for Associate Software Engineer candidates.

This is a feature build on a MERN starter.
The model, list route, Redux store, product table, and dashboard summary are already in place. You add create, update, delete, and stock adjustment.

## Time

- Expected effort: **about 4 hours**
- Submission window: usually **24 hours** (as stated in the invitation email)
- Stop after ~4 hours and document unfinished work in the README

## Stack

- React
- Redux Toolkit (store is included)
- Node.js + Express
- MongoDB + Mongoose
- JavaScript (TypeScript optional)

## Quick start

MongoDB must be reachable at `MONGODB_URL` in `server/.env`. The API port is `PORT` in that same file. The client reads `VITE_API_URL` from `client/.env`. Both env files are included.

```bash
npm run install:all
npm run seed
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:5050

## What to build

Read **[ASSESSMENT.md](./ASSESSMENT.md)** carefully and implement all required features.

## Submission

Submit with the **Fork → Clone → Branch → Pull Request** workflow. Do not commit directly to `main`.

1. **Fork** this repository to your GitHub account.
2. **Clone** your fork:

   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   ```

3. **Branch** from `main` for your work:

   ```bash
   git checkout -b assessment/<your-name>
   ```

4. Implement the assessment on that branch and commit as you go.
5. **Push** the branch to your fork and open a **Pull Request** into this repository’s `main` branch.

   ```bash
   git push -u origin assessment/<your-name>
   ```

   On GitHub, open the pull request from your branch to the original repository’s `main`.

6. In the pull request, and in the project README, include setup steps, design decisions, known limitations, approximate time spent, and any AI tools used.

Reply to the invitation email with the pull request link.

## Questions and Assistance

If you have any questions or need assistance at any stage of this assessment, please feel free to reach out to methindu@gundapower.com.

Best of luck with your assessment!
