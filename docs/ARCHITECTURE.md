# Core foundation architecture

**Status:** Local and testnet development only. The Core has no invoice, payment, verifier, or
webhook feature yet.

## Modules and responsibilities

| Module        | Responsibility                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------- |
| Configuration | Validate process settings before Nest starts; reject unsupported database URLs and invalid ports. |
| Database      | Own the Prisma client, its lifecycle, and migration-backed readiness check.                       |
| Health        | Expose liveness and readiness through a thin controller and a service.                            |

`AppModule` composes the feature modules. The health service depends on a narrow `DatabaseReadiness`
interface and an injection token exported by the database module. This keeps HTTP handling separate
from readiness policy and lets future persistence work replace the health probe without changing the
controller. The database module does not export the raw Prisma client.

The foundation uses only the interfaces it needs. Future invoice, verification, and webhook features
should each have their own module, controller or worker, application service, and persistence
adapter where appropriate. Payment state changes must use database transactions and unique
constraints in the responsible repository. Avoid adding abstraction layers that have no concrete
use.

## Startup and health

Configuration is parsed before opening the HTTP listener. `/health/live` checks that the process can
respond. `/health/ready` checks that all versioned migrations have completed and that the Core table
can be queried; it returns HTTP 503 when either condition fails. Database error details stay out of
the public response.

SQLite is limited to one instance. The target PostgreSQL migration needs its own schema, migration
and data-transfer tests; see [ADR 0003](ADR/0003-storage.md). The unique invoice address design is
recorded in [ADR 0002](ADR/0002-payment-attribution.md).
