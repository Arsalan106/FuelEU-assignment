# AI Agent Workflow

- Used an agent to scaffold hexagonal layers and ensure no core ↔ framework coupling.
- Prompts focused on:
  - Ports first, then use-cases, then adapters.
  - Idempotent banking operations with negative entries for debits.
  - Pooling greedy allocation + constraints.
- Validation steps:
  - Unit test for ComputeCB arithmetic.
  - Integration smoke test for HTTP `/health`.
- Manual checks:
  - Prisma schema aligns with spec tables.
  - Seeds create five routes with one baseline.
