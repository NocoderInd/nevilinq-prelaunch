# NEVILINQ — Monorepo Scaffold

This is a zero-cost scaffold for NEVILINQ with:
- `apps/www` — public Next.js app
- `apps/admin` — admin Next.js app
- `apps/api` — FastAPI backend
- `packages/types` — shared TypeScript types

## Prereqs
- **Node 18+** (recommend 20)
- **Python 3.11+** (works on Windows)
- **Git** (optional but recommended)

## 1) Backend (FastAPI)
```powershell
cd apps/api
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env   # or manually create .env
# edit ALLOWED_ORIGINS if your ports differ
uvicorn main:app --reload --port 8000
```
Open: http://127.0.0.1:8000/healthz → should return `{ "ok": true }`

## 2) Frontend install
```powershell
cd ../../
npm install
```

## 3) Environment files
Create `.env.local` in **both** `apps/www` and `apps/admin`:
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## 4) Run frontends
```powershell
npm run dev     # runs www:3000 and admin:3001 together
```
- http://localhost:3000 (public)
- http://localhost:3001 (admin)

Both pages fetch `/healthz` from the API and render the status.

## Notes
- CORS is preconfigured to allow http://localhost:3000 and http://localhost:3001
- Shared types import path: `@nevi/types`
- Tweak versions as needed if your environment is strict.
