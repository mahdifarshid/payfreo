# ADR 0003: SQLite for the foundation, PostgreSQL for the final service

- Status: Accepted for the Core foundation
- Date: 2026-10-25
- Decision owner: Mahdi Farshid

## Decision

The first Core runs as one instance with a local SQLite file. Its database access stays inside a
dedicated service, and versioned migrations are required before readiness succeeds. A persistent
Docker volume holds the file. Concurrent replicas and network filesystems are unsupported for this
phase.

PostgreSQL is the target for the final service. The PostgreSQL milestone will add a separate schema
and migrations, a tested data-transfer procedure, backup and restore guidance, and concurrency tests
for invoice and chain-event allocation. Changing the connection URL alone is not a migration.

The foundation pins Prisma 6.19.3. Any Prisma major upgrade must regenerate the client and pass the
Node.js 22/24 compatibility matrix before adoption. No production PostgreSQL support is claimed by
this decision.

## Consequences

- SQLite keeps the first local setup small and requires only a writable file path.
- The future payment repository API must own transactions and uniqueness rules; controllers must not
  depend directly on a specific SQL dialect.
- The PostgreSQL migration is a release gate, not an automatic result of using Prisma.
