# FuelEU Maritime — Backend

Hexagonal architecture, Node.js + TypeScript + PostgreSQL + Prisma.

## Folder Structure

```
backend/
  prisma/
    schema.prisma
    seed.ts
  src/
    core/
      domain/
        entities.ts
      application/
        compute-cb.ts
        compare-routes.ts
        bank-surplus.ts
        apply-banked.ts
        create-pool.ts
      ports/
        route-repo.ts
        compliance-repo.ts
        bank-repo.ts
        pool-repo.ts
        tx.ts
    adapters/
      inbound/http/
        routes.routes.ts
        compliance.routes.ts
        banking.routes.ts
        pools.routes.ts
      outbound/postgres/
        prismaClient.ts
        route-repo.prisma.ts
        compliance-repo.prisma.ts
        bank-repo.prisma.ts
        pool-repo.prisma.ts
        tx.prisma.ts
    infrastructure/
      server/
        app.ts
        index.ts
    shared/
      constants.ts
  tests/
    unit/compute-cb.test.ts
    integration/http.test.ts
  package.json
  tsconfig.json
  jest.config.js
  eslint.config.js
```

## Environment

Create `.env` in project root:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fueleu?schema=public"
PORT=3000
```

## Setup

```bash
# 1) Install
npm i

# 2) Generate Prisma client
npm run prisma:generate

# 3) Create DB & run migrations (interactive)
npm run prisma:migrate

# 4) Seed base data (five routes, one baseline)
npm run db:seed

# 5) Run dev server
npm run dev
```

## Endpoints

- **Routes**
  - `GET /routes` — list all
  - `POST /routes/:id/baseline` — set baseline route for its year
  - `GET /routes/comparison?year=2025` — baseline vs others, returns `percentDiff` and `compliant`

- **Compliance**
  - `GET /compliance/cb?shipId=S1&year=2025&intensity=92&fuelT=10`
    - Computes and stores a snapshot of CB in `ship_compliance`
  - `GET /compliance/adjusted-cb?shipId=S1&year=2025`
    - Returns `{ base_cb, banked_net, adjusted_cb }`

- **Banking**
  - `GET /banking/records?shipId=S1&year=2025`
  - `POST /banking/bank` JSON: `{ "shipId":"S1","year":2025,"cb":12345 }` (only positive allowed)
  - `POST /banking/apply` JSON: `{ "shipId":"S1","year":2025,"amount":5000 }`
    - Validates amount ≤ available banked (sum of entries up to year)

- **Pools**
  - `POST /pools` JSON:
    ```json
    {
      "year": 2025,
      "members": [
        {"ship_id":"A","cb_before":  8000},
        {"ship_id":"B","cb_before": -3000},
        {"ship_id":"C","cb_before": -1000}
      ]
    }
    ```
    - Greedy allocation; returns `cb_after` per member.
    - Enforces: sum CB ≥ 0, deficit cannot exit worse, surplus cannot exit negative.

## Tests

```bash
npm test        # unit + minimal integration
```

## Notes

- Formulas use constants per spec:
  - Target intensity 2025 = **89.3368 gCO₂e/MJ**
  - Energy in scope (MJ) ≈ **fuel(t) × 41,000**
  - `CB = (Target - Actual) × Energy`
- Core is framework-agnostic. Express/Prisma live in adapters.
