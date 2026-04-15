# Markdown Notes

Monorepo: Express backend + React/Vite/Tailwind frontend + Postgres, auth via Supabase.

## Setup

1. Copy env files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
2. Fill in Supabase URL + JWT secret (backend) and anon key (frontend).
3. Build and run:
   ```bash
   docker compose up --build
   ```
4. Run DB migrations (first time only):
   ```bash
   docker compose exec backend npm run migrate:up
   ```

## Ports

- Frontend: http://localhost:5173
- Backend:  http://localhost:4000
- Postgres: localhost:5432
