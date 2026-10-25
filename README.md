# PayFreo

**Self-hosted cryptocurrency payment infrastructure for developers — under development.**

> **Pre-alpha · Local/testnet only · Not for real funds**
>
> This repository currently contains specifications and development tooling. There is no implemented
> payment engine, SDK, smart contract, production deployment, or independent security audit.

_Your server. Your wallet. Verifiable payments._

**Maintainer:** [Mahdi Farshid](https://github.com/mahdifarshid)

## Why PayFreo?

PayFreo aims to provide a small, receive-only payment Core that merchants run on their own servers.
Applications will use a versioned API and thin SDKs to verify supported stablecoin payments without
requiring a maintainer-operated processor.

The initial audience is backend developers integrating payments into their own applications. Minimal
setup, reliable verification, and framework-friendly integration are design goals that still require
working code and reproducible evidence. PayFreo does not claim superiority over existing platforms.

## Current status

| Area                                                    | Status                                              |
| ------------------------------------------------------- | --------------------------------------------------- |
| Product specification and development sequence          | Documented in [DEVELOP.md](DEVELOP.md)              |
| Contributor standards and formatting tools              | Included in this repository                         |
| Formatting CI                                           | Workflow defined; hosted execution not yet verified |
| Core API, persistence, and ERC-20 verifier              | Planned                                             |
| TypeScript SDK and checkout example                     | Planned after Core verification                     |
| PHP, Python, Go, and Rust integrations                  | Later, based on demonstrated demand                 |
| Revenue sharing, governance, and escrow contracts       | Separate future modules                             |
| Public installation, production release, security audit | Not available                                       |
| Sponsorship and contributor payments                    | Not active                                          |

A feature is implemented only after code exists, documentation is accurate, and its required checks
have actually passed. Planned integrations are not supported integrations.

## How it will work

```text
Merchant application → Authenticated API / thin SDK → Merchant-hosted Core
                                                      ├── Local database
                                                      ├── Configured blockchain RPC
                                                      └── Signed webhook delivery
Customer wallet ───── ERC-20 transfer ───────────────→ Merchant wallet
```

The customer signs in their own wallet. The Core observes and verifies the chain, token contract,
recipient, exact amount, transaction receipt, transfer event, and confirmation evidence. It must not
request merchant private keys or sign withdrawals.

Ordinary ERC-20 transfers do not carry an invoice ID. The MVP therefore requires explicit,
wallet-controlled payment attribution and atomic event uniqueness. Ambiguous transfers must remain
unsettled for review. Reconciliation, replay protection, reorganization handling, and idempotent
webhooks are required before claiming reliable payment verification.

## Development setup

This setup runs repository tooling only. There is no payment service to start yet.

Prerequisites: Node.js **24 LTS** (recommended; pinned to **24.22.1**) or Node.js **22.13.0+ within
22.x**, with pnpm **11.10.0**. Formatting CI is configured for both Node.js 22 and 24. Application
compatibility will be validated when runtime code exists.

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm format:check
```

Run `pnpm format` to apply formatting. Read [CONTRIBUTING.md](CONTRIBUTING.md) for organization,
English-language requirements, organization, and review expectations.

## Architecture and roadmap

The proposed stack is TypeScript, Fastify, a reviewed EVM client, OpenAPI 3.1, SQLite for a single
Core instance, and a durable database-backed worker. SDKs share the API contract and do not
reimplement blockchain verification.

Development proceeds through these milestones:

1. Repository standards, English documentation, and formatting checks.
2. Discovery, architecture, payment-attribution design, threat model, and licensing review.
3. Core skeleton with validated configuration, persistence, health checks, Docker, and tests.
4. Testnet invoice verification, reconciliation, replay protection, and signed webhooks.
5. TypeScript SDK, reproducible checkout demo, and release/contributor tooling.
6. Static documentation site and verified sponsorship information.
7. Additional SDKs after core validation; separately reviewed optional contract modules later.

See [DEVELOP.md](DEVELOP.md) for acceptance criteria, security gates, and the intended repository
layout. No milestone has a promised delivery date. A static documentation site will not host the
payment engine, merchant configuration, or secrets.

The documentation website is planned for GitHub Pages using its default `github.io` address; no
custom domain purchase is required. Website deployment is pending.

## Contributing and security

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Keep changes focused, use English documentation and
Conventional Commits, and include meaningful validation evidence. Formatting checks are available;
runtime tests will be introduced alongside implementation.

The MVP is receive-only: no custody, merchant withdrawal credentials, hidden fees, automatic
payouts, spender allowances, or mandatory maintainer backend. A compromised application or RPC can
still mislead users; the design does not eliminate financial risk.

Private vulnerability reporting, a threat model, incident procedures, and independent security
review are required before an applicable public code or production release. Those processes are
planned; no private contact channel or audit is claimed here. Do not post sensitive vulnerability
details in public issues or use real funds for development.

## Support development

PayFreo is intended to be funded through **voluntary cryptocurrency sponsorship**, separate from
merchant customer payments. Funding may support maintainer work, documentation, infrastructure,
independent security review, and accepted contributor work.

**Donations and paid bounties are not active.** No verified donation address or live sponsorship
page is published yet. A donation will not confer equity, investment returns, governance control, or
an exemption from review.

Before activation, publish the funding and bounty policies described in DEVELOP, verify the actual
receiving network/token/address and support page, and complete the required eligibility review. Only
then link the live support page from this README and `.github/FUNDING.yml`. Do not assume an
activated GitHub Sponsors account or promise unfunded rewards. Aggregate funding reports should
respect donor and contributor privacy.

## Licensing and project identity

**PayFreo is the selected project brand.** The public repository is
[mahdifarshid/payfreo](https://github.com/mahdifarshid/payfreo). Domain ownership, trademarks, and
public package identifiers have not been verified. No deployed website is claimed.

The provisional licensing proposal is AGPL-3.0-only for the Core, Apache-2.0 for SDKs and marked
code examples, and CC BY 4.0 for documentation where authors agree. Future contracts require a
separate license decision. Canonical license files and approval are still pending; do not assume
these proposed permissions have already been granted.

The maintainer's residence and prospective payment routes require a separate review before real
sponsorship, payouts, or commercial operations. See DEVELOP for existing legal and operational
requirements. The project is proposed software for independent operation, not an exchange,
investment product, payment guarantee, or maintainer-operated custody service.
