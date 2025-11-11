# FuelEU Maritime — Frontend (React + TS + Tailwind)

A clean, hexagonal-lean React frontend for the FuelEU backend.  
Tabs: **Routes**, **Compare**, **Banking**, **Pooling**.

## Setup

```bash
npm i
echo VITE_API_URL=http://localhost:3000 > .env.local
npm run dev
# open http://localhost:5173
```

## Structure

```
src/
  core/                # types/ports
  adapters/
    infrastructure/    # API client
    ui/                # pages
  shared/              # config
```

## Notes

- Charts powered by Recharts
- API base URL via `VITE_API_URL` (defaults to `http://localhost:3000`)
