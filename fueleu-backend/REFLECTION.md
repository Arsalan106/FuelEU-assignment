# Reflection

- Hexagonal boundaries kept core pure (no imports from Express/Prisma in `core/`).
- Greedy pooling ensures deterministic allocation and constraint validation.
- Banking model records debits as negative entries to keep ledger additive.
- Future work:
  - More exhaustive tests for pooling/banking edge cases.
  - Role-based auth & request validation with Zod schemas per endpoint.
  - Add transaction scoping to pool creation if also reading from other tables.
