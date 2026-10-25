# ADR 0001: First PayFreo Core scope

- Status: Accepted for local and testnet development
- Date: 2026-10-25
- Decision owner: Mahdi Farshid

## Context

PayFreo needs a small, understandable starting point before it can verify payments. Existing
self-hosted projects already provide broad cryptocurrency payment features. A narrow Core makes the
trust boundary and test requirements easier to review.

## Decision

The first Core is a merchant-operated, receive-only service for a single configured EVM chain and
ERC-20 test token. It will eventually expose a versioned HTTP API for invoice creation, transaction
submission, status, and signed notifications. Customers sign transfers in their own wallets. The
merchant supplies public receiving addresses and controls the server, database, and RPC provider.

The foundation milestone provides configuration, persistence, health checks, tests, and local
deployment only. Invoice endpoints and blockchain verification require a separate implementation and
security review. All examples remain local or testnet-only.

The service must never request or store private keys, seed phrases, signing credentials, or spender
approvals. It must not initiate withdrawals, sweeping, payouts, custody, or escrow. GitHub Pages,
when introduced, serves static project information and never hosts the Core or merchant secrets.

## Consequences

- The first release cannot accept real payments or claim production readiness.
- A merchant must provision receiving addresses outside PayFreo.
- A dedicated PostgreSQL deployment is planned before a final release; SQLite is limited to the
  initial single-instance service.
- Additional chains, SDKs, optional contracts, and a public site follow only after their own gates.

## References

- [Development plan](../../DEVELOP.md)
- [Payment attribution decision](0002-payment-attribution.md)
- [Threat model](../THREAT_MODEL.md)
