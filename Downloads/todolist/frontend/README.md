# To-do frontend

React + Vite interface for the Fastify/MySQL API in `../backend`.

## Start the backend

The backend uses Node.js, Fastify and MySQL. Create the database from the repository root if needed:

```sh
mysql -u root -p < backend/schema.sql
```

From `backend/`, install dependencies and run the server:

```sh
npm install
npm run dev
```

The API listens at `http://localhost:3333` by default. Optional backend variables are `PORT`, `CORS_ORIGIN`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` and `DB_NAME`. Defaults are port `3333`, MySQL host `localhost`, port `3306`, user `root`, blank password and database `todolist`. The backend's default CORS origin is `http://localhost:5173`.

## Start the frontend

From `frontend/`:

```sh
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. `VITE_API_URL` defaults to `/api`; Vite proxies API and health requests to `http://localhost:3333`. Set `VITE_API_URL` to another API base URL if needed.

## API used

- `GET /api/tasks?search=` returns `{ tasks, total, completed }`. Search is performed by the server. Tasks are ordered by due date, null dates last, then newest creation first.
- `POST /api/tasks` accepts `{ title, dueDate? }` and returns the created task (201).
- `PATCH /api/tasks/:id` accepts any of `{ title?, dueDate?, completed? }` and returns the updated task. Use `dueDate: null` to clear a date.
- `DELETE /api/tasks/:id` returns 204.
- `GET /health` returns `{ status: "ok" }`.

Task records contain numeric `id`, string `title`, boolean `completed`, nullable `due_date` (`YYYY-MM-DD`), and `created_at`/`updated_at` timestamps. The frontend uses API data only; it does not seed sample tasks.

## Folders

```text
src/
  components/   Reusable task, search and modal UI
  hooks/        Search debounce
  services/     Centralized API client
  App.jsx       Page state and interactions
  styles.css    Responsive layout and visual styling
```
