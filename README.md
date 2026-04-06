# Finora Frontend (Vite + React + TypeScript)

This is the web app for Finora (UI + auth + charts + dashboard).

- **Backend repo**: `https://github.com/<your-username>/finora-backend`

## Tech

- Vite + React + TypeScript
- React Router
- shadcn/ui + Tailwind
- Supabase client

## Setup

```bash
cd trade-sage-ai-68
npm install
```

## Environment variables

Create a `trade-sage-ai-68/.env` file (do **not** commit it). Common values:

- `VITE_SUPABASE_URL=...`
- `VITE_SUPABASE_ANON_KEY=...`
- `VITE_API_BASE_URL=http://localhost:5001` (or your deployed backend)

## Run (dev)

```bash
cd trade-sage-ai-68
npm run dev
```

Vite will print the local URL (commonly `http://localhost:5173`).

## Build

```bash
cd trade-sage-ai-68
npm run build
npm run preview
```

## Legal pages

- `/terms`
- `/privacy`

