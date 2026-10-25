# PayFreo threat model

**Status:** Initial design draft, 2026-10-25. No payment verifier, audit, or production deployment
exists. Revisit this document before implementing invoices and whenever a trust boundary changes.

## Assets and actors

Assets include invoice records, event allocation, merchant API credentials, webhook secrets,
operator configuration, and the integrity of fulfillment decisions. Actors are the merchant
operator, merchant application, customer wallet, configured RPC provider, Core service, database,
and webhook receiver. PayFreo's maintainer does not operate the merchant service or hold funds.

## Trust boundaries

| Boundary                              | Threat                                                          | Required control or open work                                                                        |
| ------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Merchant app to Core                  | Forged invoice or stolen API credential                         | Scoped authentication, input validation, rate limits, and secret redaction in the payment milestone. |
| Merchant address provisioning to Core | Reused or attacker-controlled destination                       | Permanently unique address reservation; merchant must verify address ownership outside Core.         |
| Customer wallet to chain              | Malicious frontend changes token, chain, amount, or destination | Checkout must display exact values and require customer wallet confirmation.                         |
| RPC to verifier                       | False, stale, or inconsistent chain data                        | Verify canonical receipt and logs, confirmations, and recovery from stale RPC data.                  |
| Verifier to database                  | Replay, double allocation, race, or crash                       | Atomic uniqueness for event identity, transactions, and restart-safe reconciliation.                 |
| Core to webhook receiver              | Forged callback, replay, or SSRF                                | Signed events, deduplication, retries, and strict outbound destination policy.                       |
| Operator to local data                | Credential leakage or database loss                             | Restrictive file permissions, backups, migration checks, and no secrets in logs.                     |

## Foundation controls

The first service accepts no payment instructions. It binds to localhost by default, validates
configuration before listening, reports database failures through readiness, and keeps its SQLite
file outside the container image. No default API key or production wallet is provided. A successful
health response must never imply that payment verification is available.

## Payment implementation gates

Before settlement can be marked paid, test wrong chain, token, recipient, amount, expired invoice,
receipt failure, duplicate event, two transfers in one transaction, concurrent claims, reorg,
untrusted RPC behavior, process restart, and late transfer to an expired address. Webhooks need
signature, replay, duplicate, and SSRF tests. Independent review remains required before handling
real funds.

## Open questions

- How does a merchant demonstrate control of each externally provisioned public address?
- Which chain and test token will be the first deterministic integration fixture?
- What confirmation depth and reorganization policy will be used on that chain?
- What is the retention and backup policy for invoice and event evidence?

These questions block payment implementation or production claims, not the local Core foundation.
