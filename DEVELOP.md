# PayFreo — DEVELOPMENT MASTER PLAN

> **Status:** Planning specification, not an assertion of implemented functionality. **Project
> owner:** [Mahdi Farshid](https://github.com/mahdifarshid) **Project brand:** PayFreo (selected by
> the maintainer; the public repository exists, while domain, trademark and package availability
> remain unverified). **Document version:** 0.2 — 2026-10-25 **Language for all documentation,
> comments, contributor-facing text and working documents:** English. **North star:** _Your server.
> Your wallet. Verifiable payments._

## 0. Engineering standards

### Repository foundation and working-file policy

The current milestone provides English project documentation, contributor standards, a private root
tooling package, pinned Prettier configuration, and a formatting-only CI workflow. Payment code,
workspaces, SDKs, contracts, and deployment remain future work. Read
[CONTRIBUTING.md](CONTRIBUTING.md) for the maintained development conventions and local commands.

Write all documentation, comments, and working files in English. Keep temporary plans under
`agent/plans/`, execution reports under `agent/reports/`, and research or scratch artifacts under
`agent/notes/`. Create these ignored local directories when needed; never force-add their contents.
Do not scatter working files throughout the public source tree. Git and Prettier exclude root
`agent/`; future lint, build, and container configurations must exclude it too.

Maintained specifications, architecture decisions, security documentation, contributor guidance, and
reproducible public evidence are project deliverables and remain versioned. Public documents and
builds must never require the local `agent/` directory. Raw execution logs stay local; public PRs
and release notes contain concise, relevant validation evidence.

Use the committed formatter settings throughout development: UTF-8, LF, final newline, two-space
indentation, 100-character preferred width, semicolons, single quotes, and trailing commas. Pin
tools and commit the generated lockfile. Add ESLint and TypeScript checks when source code is
introduced; do not label unimplemented checks as passing.

Preserve existing local tool configuration in place. Repository cleanup must not delete, move,
rename, or rewrite it. Keep it excluded from Git and build inputs; do not relocate configuration
into the scratch workspace.

### Node.js compatibility policy

Node.js 24 LTS is the primary development target, pinned in `.node-version`. Preserve compatibility
with Node.js 22.13.0 and later 22.x versions; pnpm 11.10.0 sets that minimum. The root engine range
admits only these two release lines. Formatting CI runs a Node.js 22/24 matrix. Extend this matrix
with lint, type checks, builds, and runtime tests as implementation arrives. Do not use Node.js
24-only APIs or dependencies that exclude Node.js 22 without an explicit compatibility decision.
Keep `.node-version`, CI pins, the package manifest, and contributor documentation synchronized.

### Task workflow

This document defines the product specification, security constraints, roadmap, repository policy,
and acceptance criteria for contributors and reviewers. Work incrementally. **Do not claim anything
was built, tested, audited, compliant, secure, production-ready or deployed without direct
evidence.** If the execution environment prevents a step, explicitly mark it **NOT RUN** and explain
the blocker. Never fabricate command output, API behavior, performance metrics, installed versions,
security audits, project adoption, benchmarks or competitive advantages.

At the start of each task: inspect the repository tree, current branch, `git status`, dependency
manifests/lockfiles, toolchain versions, current tests and documentation. Write a small scoped plan;
implement the minimum change; run targeted checks; review the diff; update documentation; and
summarize changed files, commands, passed/failed/not-run checks, risks and next steps. No
unsolicited rewrite of existing code. Never access production wallets or actual assets for testing.
Never invent donation addresses, security contacts, license approvals or release records. Ask for
secrets only via secure local environment configuration; never commit or display them.

If these instructions conflict with security, law, a verified dependency API or updated maintainer
requirements, identify the conflict before risky action. Financial or legal deployment requires
review by qualified professionals. The default is **TESTNET / LOCAL ONLY** until documented release
gates are satisfied.

### Immutable implementation principles

1. **Non-custodial:** Core must never request, store, derive, transmit or process merchant private
   keys, seed phrases or signing credentials. Customer-side signing stays in the customer's
   independently verified wallet.
2. **Receive-only minimal core:** No withdrawals, sweeping, transfer signing, spender approvals,
   payouts, custody or escrow in the initial core.
3. **No developer dependency:** No mandatory developer-operated API, license server, telemetry,
   mandatory cloud account or hidden outbound connection. RPC providers and allowed outbound
   integrations are explicitly configured by operators. No hidden fee recipient.
4. **User-operated:** Each merchant owns the server, database, RPC choices and configured receiving
   address. Do not use the maintainer's infrastructure to process customers' funds.
5. **Clear trust boundaries:** Never advertise the absence of risk. An infected frontend can replace
   recipients; a compromised RPC can lie; a broken verifier can falsely fulfill an order.
   Proactively warn users.
6. **Separation of concerns:** Core API and verification; language SDKs; checkout examples; optional
   future on-chain contracts. Each can be evaluated independently.
7. **Small first:** Build a narrow, reliable testnet MVP before adding chains, frameworks, escrow,
   governance or customer-facing SaaS.
8. **Open by default:** All code, migrations, build scripts, deployment definitions, documentation,
   tests and relevant configuration templates are public. No proprietary critical component.
9. **Safe source handling:** Never publish actual credentials, customer financial details, secrets,
   private security disclosures or contributor private information.
10. **Respect law:** No claims of legal immunity; no assistance concealing sanctions-related
    identities, evading service restrictions or circumventing payment compliance.

## 1. Product concept, audience and validated differentiation

**One independent, self-hosted stablecoin payment engine with a versioned REST/OpenAPI contract and
framework-native SDKs.** First audience: developers who need to accept **single ERC-20 payments**
into their own wallet and verify order fulfillment inside existing applications.

Target frameworks over time: Laravel/PHP, NestJS/Express/Fastify/TypeScript, Django/FastAPI/Python,
Go (net/http; Gin/Fiber examples), Rust (reqwest; Axum/Actix examples), optionally Spring Boot/Java
and ASP.NET/C# after usage evidence.

### Competitive landscape and honesty rule

Before implementation/README claims, benchmark relevant competitors such as BTCPay Server, Bitcart
and PayRam. They already support non-custodial, self-hosted crypto payments and varying
integrations. **Never claim “first,” “only,” “most secure,” “zero risk,” “faster” or “five-minute
setup” without a reproducible, dated comparison.** Potential differentiation is a narrowly scoped
receive-only service, minimum resource and configuration burden, independently auditable validation,
excellent native SDKs and deterministic test fixtures. These are **design hypotheses** until
demonstrated.

Maintain `docs/COMPETITOR-BENCHMARK.md` with product/version/date, hardware, operating system, exact
steps, configuration, measured install time, resource metrics, test scenario, known disadvantages,
and links. Do not use misleading performance comparisons.

### Out of scope for MVP

Hosted SaaS, cross-chain swaps, exchange or fiat conversion, debit/credit card payments, customer
identity custody, merchant payouts, payment arbitration, automatically derived deposit keys,
universal manual-transfer matching, address generation using private keys, subscriptions, token
exchange rate feeds, escrow, revenue splits, operator commissions, dashboard-heavy features or
production Mainnet guarantees.

## 2. Release phases and explicit security gates

| Stage                        | Deliverable                                                                                          | Gate                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 0: Discovery                 | Competitive benchmark, design RFC, threat model, license review, legal questions                     | Approved scope; no coding claims                                                       |
| 1: Local/testnet MVP (`0.x`) | Core API + persistence + one test ERC-20/chain + reference TS client + test fixture + Docker Compose | Full local integration test suite passing; testnet-only warnings                       |
| 2: Framework SDKs            | TypeScript package and Laravel integration, then Python and remaining language clients               | Common conformance suite; SDK examples; API version policy                             |
| 3: Production candidate      | Operational hardening, independent security review, incident policy, risk review, deployment guide   | **Never release as production-ready without documented technical and legal approvals** |
| 4: Optional Consortium       | Independently deployed, transparent smart contract for fixed-share ERC-20 revenue allocation         | Foundry invariants/fuzz, immutable accounting, independent audit before real funds     |
| 5: Optional Governance       | Partner-controlled, versioned share updates and voting                                               | Governance abuse analysis, timelock/quorum tests, rights preservation                  |
| 6: Optional Escrow           | Testnet conditional holding, release, refund and dispute flow                                        | Dedicated legal review, independent audit, explicit roles and failure-state tests      |

No later phase is permission to bypass earlier safety gates. Every planned feature is documented as
_planned_, not _available_.

## 3. Technical architecture

### Recommended initial implementation

- **Core:** TypeScript, Node.js 24 LTS as the primary runtime with Node.js 22 compatibility, Fastify
  (or comparably minimal documented HTTP framework), strict types and runtime schemas (e.g. Zod),
  OpenAPI 3.1, a typed EVM client such as Viem. Verify pinned compatible versions rather than
  hardcoding unverified versions.
- **Storage:** SQLite for single-instance MVP, with persistent Docker volume, WAL as appropriate,
  migrations and backups; design a repository layer permitting PostgreSQL later. Explicitly disallow
  multi-replica operation on SQLite without validated coordination.
- **Job processing:** Durable database-backed reconciliation scheduler for MVP. Redis, NATS, Kafka
  etc. are **optional future adapters**, not boot prerequisites.
- **Infrastructure:** Minimal multi-stage Docker image, non-root process, read-only filesystem where
  feasible, dropped capabilities, health/readiness endpoints, compose file and `.env.example`.
- **Testing:** Node test runner or Vitest; local Anvil/Foundry for deterministic EVM receipts/events
  and failure tests; API contract/conformance tests.
- **Documentation/website:** Astro or Vite static build with GitHub Pages compatible base path, or a
  plain HTML/CSS static site if simpler. No runtime backend on GitHub Pages.
- **No mandatory admin dashboard in MVP.** Build a nice static landing site, examples and an OpenAPI
  explorer that never embeds merchant secrets.

### Logical diagram

```text
Merchant app ── SDK / signed API credentials ──> PayFreo Core (merchant-hosted)
  Laravel / TS / Python / Go / Rust                 ├─ Invoice API / auth / limits
                                                   ├─ verifier + reconciliation
                                                   ├─ durable DB / migrations
                                                   ├─ signed webhook dispatcher
                                                   └─ operator-selected EVM RPC(s)
Buyer wallet ── direct ERC-20 transfer ─────────> Merchant public wallet
                       │
                       └─ on-chain receipt/logs → Core verifies → internal fulfillment event
```

A GitHub Pages landing site is **not** a payment processor, escrow holder, invoice engine or server
for merchant secrets.

### Suggested monorepo

This tree is a target layout, not an inventory of implemented files. Create future directories only
when needed. The root tooling package is private; its name does not reserve a public package name.

```text
payfreo/
├── agent/{plans,reports,notes}/  # local only; ignored, created as needed
├── DEVELOP.md
├── README.md
├── LICENSE / NOTICE / TRADEMARKS.md / DISCLAIMER.md
├── SECURITY.md / CONTRIBUTING.md / CODE_OF_CONDUCT.md
├── BOUNTY_POLICY.md / FUNDING_POLICY.md / GOVERNANCE.md
├── CHANGELOG.md / .editorconfig / .gitignore
├── .env.example
├── .github/
│   ├── FUNDING.yml
│   ├── CODEOWNERS
│   ├── ISSUE_TEMPLATE/{bug_report.yml,feature_request.yml,security.md,bounty_proposal.yml}
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── workflows/{ci.yml,codeql.yml,dependency-review.yml,release.yml,pages.yml}
│   └── dependabot.yml
├── apps/
│   ├── core/
│   └── website/                 # static landing/docs, GitHub Pages
├── packages/
│   ├── sdk-ts/
│   ├── sdk-php/                 # later
│   ├── sdk-python/              # later
│   ├── sdk-go/                  # later
│   └── sdk-rust/                # later
├── contracts/                   # later; isolated Foundry project
├── examples/{node-checkout,laravel-checkout}/
├── infra/{docker,compose}/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── THREAT_MODEL.md
│   ├── TRUST.md
│   ├── RISK_DISCLOSURE.md
│   ├── SECURITY_CHECKLIST.md
│   ├── COMPETITOR-BENCHMARK.md
│   ├── INCIDENT_RESPONSE.md
│   ├── RELEASE_PROCESS.md
│   ├── LEGAL_REVIEW_CHECKLIST.md
│   └── ADR/
└── tests/{integration,conformance,security}/
```

Only create directories/files when they serve the current phase. Empty future SDKs need not be
generated. Use pnpm workspaces and commit a lockfile; pin container base image references for
security-conscious releases.

## 4. MVP payment model and correctness

**MVP mode:** controlled wallet-connected payment intent via an application checkout. No universal
invoice attribution for unprompted wallet transfers. Require full transaction identity and strict
business rules. Do not equate `HTTP 200`, `tx hash supplied`, `wallet balance increased`,
`receipt.success` alone, or `some Transfer log exists` with successful invoice settlement.

### Illustrative API (to finalize in OpenAPI RFC)

```http
POST /v1/invoices
GET  /v1/invoices/{invoiceId}
POST /v1/invoices/{invoiceId}/submit-transaction
GET  /v1/payments/{paymentId}
GET  /health/live
GET  /health/ready
```

Sample create request (server-to-server authentication):

```json
{
  "externalOrderId": "order-123",
  "chainId": 80002,
  "assetContract": "<configured-test-token-address>",
  "amountAtomic": "25000000",
  "recipient": "<merchant-public-address>",
  "payer": "<connected-customer-address>",
  "expiresAt": "<ISO8601>"
}
```

Use checksummed/canonical wallet addresses, configured chain IDs and trusted token contract
addresses; no token-symbol-only matching. Monetary units are base-unit integers represented as
strings, never JavaScript floating-point. Confirm chain ID, exact ERC-20 contract address, receipt
success, canonical block membership, Transfer event recipient, relevant payer constraints, value,
expiration policy and sufficient finality depth. Record transaction hash **plus log index / event
identity** to support event-level accounting, and enforce atomic uniqueness in persistent storage.
Define whether one invoice accepts multiple transfers, overpayments or partial payments: **MVP
rejects unsupported cases**. A payment from a contract wallet or aggregation service may not have
`tx.from` equal to the token transfer sender; use event and explicit policy rather than naive
assumptions.

### Important limitation and design gate

A recipient address shared across many invoices cannot inherently prove that an unlabelled direct
ERC-20 transfer corresponds to a particular invoice. The buyer can claim someone else's transfer or
a transfer cannot be uniquely attributed. Therefore **MVP must not automatically accept a
transaction hash submitted by an arbitrary caller as proof of ownership or exclusive invoice
fulfillment**. Implement a design RFC evaluating (a) authenticated payer-wallet proof of intent and
atomic allocation of eligible transfer events, with residual spoofing/ambiguity documented; (b)
unique merchant-controlled recipient addresses, without importing private keys into core; and (c)
future invoice-identified payment contract. Require explicit acceptance of this risk before choosing
(a). For mainstream production-grade invoice attribution, a non-upgradeable minimal payment contract
carrying an invoice ID may be preferable, but it changes the no-contract goal and must be
independently reviewed. **No overstatement of correctness before this is resolved.**

### State machine and lifecycle

`CREATED → AWAITING_PAYMENT → OBSERVED → CONFIRMING → PAID` with explicit `EXPIRED`, `FAILED`,
`UNDERPAID`, `OVERPAID`, `REORGED`, `REQUIRES_REVIEW` branches as appropriate. A block
reorganization can roll back previously observed confirmation counts; define settlement confidence,
monitor finality, and make fulfillment semantics explicit. Once merchant fulfillment occurs, later
reversal has a documented incident/reconciliation path. Every state transition has atomic
persistence, timestamp, evidence and deduplicated event/webhook delivery.

### Webhook rules

HMAC-SHA256 signatures with timestamp and replay tolerance; secret rotation; stable event IDs; retry
with exponential backoff and bounded DLQ; at-least-once delivery, not false exactly-once guarantee;
merchant must dedupe by event ID. Never send secrets or customer financial data to unknown domains.
Support URL allowlists/SSRF protections, reject loopback/link-local/metadata network targets,
resolve DNS safely against rebinding, and block internal networks by default. Server-to-server API
credentials must be hashed where feasible, scoped and never be exposed in browsers.

### Necessary tests (none may be silently skipped)

Happy-path ERC-20 event, wrong chain/token/recipient/amount/payer, token decimals, underpayment,
overpayment, replayed hash/log, expired invoice, two same-amount invoices, two events in one
transaction, adversarial third-party claim, failed receipt, chain reorg, stale/malicious RPC,
restart during pending verification, duplicate queue execution, webhook replay/signature failure,
SSRF URL, race conditions and concurrent claim, wallet-connected authorization and idempotency.
Deterministic on-chain fixtures; fuzz/property tests for amount allocation and financial accounting.
Report security test coverage honestly; do not use invented percentages.

## 5. Future optional on-chain modules — not MVP

### 5.1 Consortium / revenue sharing

Self-deployed per merchant and publicly verified contract bytecode. Initial contract: **fixed shares
only**, configured using integer basis points summing exactly 10,000; pull-based ERC-20 claims,
reentrancy protection, strict asset allowlist, predictable dust handling and accurate event
accounting. No developer admin, hidden fee or arbitrary asset transfer. Define
fee-on-transfer/rebasing tokens as unsupported unless formally designed. Separate governance from
distribution. **Share changes must never retroactively reduce previously accrued entitlements**:
snapshot each deposit against a split-version, or settle into immutable credits at receipt. Validate
invariant `distributed + claimable + explicitly-accounted dust = received` subject to token
behavior. Do not conflate wallet share, voting power and admin roles.

### 5.2 Consortium governance

Only after a working fixed-share splitter: membership policy, independent voting units, quorum,
voting windows, proposal validation, time delay, tie/deadlock handling, guardian restrictions and
change-history events. Evaluate Safe multisig for a simpler initial governance layer, and
OpenZeppelin Governor only when justified. Avoid a single maintainer-owned superuser, stealth
upgrades or silent beneficiary changes. Test for member self-dealing, threshold manipulation,
removal of stakeholders and share confiscation.

### 5.3 Escrow / conditional payments

Dedicated opt-in contract, not part of receive-only core. Buyer deposits; clear policy for release,
refunds, expiry, disputes, arbitrator authority, and timelock. Contracts cannot independently
establish that a consulting session took place; external evidence and judgment require explicit
trust/consent. Reentrancy, griefing, stuck funds, compromised arbiter and default behavior require
invariants and threat analysis. **Testnet only** until separate security audit and regulatory/legal
review. No platform-run dispute arbitration by the project maintainer as a default service. No
promise that escrow is legally equivalent to Stripe or licensed escrow services.

## 6. Law, responsible operation and liability controls

**Not legal advice.** Maintainer residence in Iran presents potentially significant sanctions,
payments, contracts, financial regulation and tax issues. Open-source code publishing, managing
third-party funds, serving foreign clients, accepting cross-border crypto donations and issuing paid
bounties are legally distinct activities. Before any real-funds product launch, hosting/payment
operations, commercial agreement or cross-border transfer, obtain written counsel familiar with
Iranian rules, US/EU sanctions where applicable, and relevant customer jurisdictions. Do not assume
non-custodial, USDC/USDT, AGPL, self-hosting or disclaimers automatically establish legal compliance
or immunity. Do not conceal residence, use false identities or route funds to evade restrictions. Do
not claim eligibility for GitHub Sponsors or any third-party payment provider without checking its
current supported regions and terms. Avoid unlawful counterparties or restricted funds. Consider how
stablecoin issuers/centralized services can freeze addresses.

Place risk disclosure in README, install wizard and documentation, with prominent TESTNET ONLY
labels until release gates. Include privacy/retention guidance, data minimization, logs redaction,
incident contact procedures, limitations of support and non-warranty notices; do not claim that
boilerplate nullifies fraud/negligence/statutory liability. Always identify who is the independent
merchant/operator and who is the software maintainer. Never operate users' escrow, keys or
production funds by default. Seek legal review before forming a business, accepting donations,
offering hosting/support or promising contributors compensation. Trademarks may protect brand
identity, not block lawful source reuse.

## 7. Licensing policy — provisional pending review

Provisional model **Core: AGPL-3.0-only; SDKs: Apache-2.0; documentation: CC BY 4.0 where authors
agree; code examples Apache-2.0 or explicitly marked permissive**. On-chain contracts require
separate license review considering verifier compatibility, reuse, adoption and source publication;
don't assume AGPL is the best choice for bytecode deployed by unrelated merchants. Alternative for
Core: MPL-2.0 if widespread embedded use becomes more valuable than network copyleft. Both models
allow commercial use; neither stops forks or lawful competition or guarantees avoidance of lawsuits.
Include full canonical license texts, SPDX identifiers, NOTICE where required, third-party license
inventory, contributor inbound=outbound policy and clear scope for directories. No license changes
without maintainer review and contributor rights analysis. Explicit trademark policy for `PayFreo`
logo/name.

## 8. Open-source repository governance and Git standards

### Default branch and development model

- `main`: protected, releasable, PR-only; never force-push; no direct pushes except documented
  emergency process.
- `feat/<issue>-short-slug`, `fix/<issue>-short-slug`, `docs/<issue>-short-slug`,
  `test/<issue>-short-slug`, `chore/<issue>-short-slug`, `security/<issue>-short-slug` (private
  security branches for embargoed reports).
- `release/vX.Y.Z`: optional short-lived release stabilization only once needed. Avoid permanent
  `develop` branch for a small project.
- `hotfix/<issue>-slug`: production patch with accelerated review, signed/tagged release and
  incident note.
- Protect `v*` tags against deletion/reuse; signed annotated tags when feasible. GitHub Rulesets on
  `main` and `v*`, required tests/approval, linear history or squash merging, no force push or
  bypass except documented emergencies.

### Commit conventions — Conventional Commits

Format `type(scope): imperative summary` in English, max ~72 characters when practical. Types:
`feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`, `chore`, `security` (custom type;
configure parser), `revert`. Scopes include `core`, `api`, `verifier`, `db`, `sdk-ts`, `contracts`,
`docs`, `site`, `ci`. Explain why in body; reference `Closes #N` in PR. Breaking changes via `!` or
`BREAKING CHANGE:` and documented migration. Examples:

```text
feat(core): add durable invoice state machine
fix(verifier): reject ERC-20 events from wrong chain
security(api): prevent webhook callback to private networks
test(core): cover concurrent transaction allocation
docs(readme): clarify testnet-only limitations
ci(pages): deploy static docs after validated build
feat(api)!: rename amount to amountAtomic
```

No meaningless commits (`update`, `fix bug`, `final`, `changes`). Do not make fake commit history,
misleading authorship, fake co-authors or automated sign-offs on behalf of humans. Make small
reviewable commits; no secrets or generated lockfile mismatch. PR description: what/why/risk/test
results/screenshots when relevant/linked issue/breaking change/migration/checklist. Require extra
review for payment verification, authorization, Docker supply chain and Solidity changes.
Contributors retain credit via Git history and changelog.

### Version and release conventions

- Semantic Versioning (`v0.1.0` etc.), explicit API compatibility and change log, no silent breaking
  changes. Pre-1.0 may change, but still document impact. Package-specific versions if monorepo
  workflows warrant them; do not blindly tag all packages as released.
- GitHub Release must include summary, compatibility, migration, security notes, full diff,
  artifacts checksum/SBOM, provenance where implemented, and exact CI run link.
- `latest` container tag only points to stable published builds, never an untested CI branch.
  Immutable digest recommendations for deployments.
- GitHub topics: `open-source`, `crypto-payments`, `stablecoin`, `self-hosted`, `non-custodial`,
  `evm`, `polygon`, `typescript`, `payment-gateway`, `blockchain`, `web3`, `developer-tools`, `api`,
  `docker`. Set only relevant supported ones and update as features ship. **Topics are discovery
  metadata, not Git tags.**
- Labels: `good first issue`, `help wanted`, `bug`, `enhancement`, `documentation`, `security`
  (never disclose embargoed vulnerabilities), `bounty:proposed`, `bounty:funded`, `bounty:claimed`,
  `bounty:paid`, `status:blocked`, `scope:core`, `scope:sdk`, `scope:contracts`,
  `priority:P0/P1/P2`.

### Community practices

Use GitHub Discussions for support/proposals; issue templates and contribution guide; optional
monthly dev update; public roadmap and decision records (`docs/ADR/`). Document code of conduct,
governance/maintainers and moderation policy. Two independent reviewers on risky financial code when
feasible; absence must be disclosed. Do not automatically merge PRs touching security-critical code
without human review. Enable private vulnerability reporting and `SECURITY.md` instructions. Do not
advertise nonexistent audits, sponsorships or customer logos.

## 9. CI/CD and GitHub Actions — minimum required

**Foundation exception:** `.github/workflows/format.yml` currently runs only the real formatter
check on pull requests and pushes to `main`. It uses pinned actions, read-only permissions, frozen
installs, and no publication steps. `.github/dependabot.yml` maintains action and npm dependency
update proposals. Hosted execution and repository branch protection must be verified after GitHub
setup. The jobs below are staged requirements: add each with the corresponding implementation and
never replace it with a placeholder success command.

**CI must run on every PR and push to `main`**, with appropriate path filtering that does not skip
required security checks. Pipeline jobs:

1. Lint + formatter check + typecheck.
2. Unit tests, integration tests against local deterministic Anvil token, concurrency/replay and
   migration tests.
3. Build core and TS SDK, static documentation site and any example maintained at that stage.
4. SCA/dependency audit, license checking, secret scanning and dependency review for PRs where
   available.
5. CodeQL supported-language security analysis and container scans after Docker image exists.
6. Contract compile, Foundry unit/fuzz/invariant tests only after contracts module introduced;
   Slither review when feasible.
7. Optional conformance matrix per SDK as added (PHP, Python, Go, Rust); never show green for jobs
   not executed.
8. Release workflow on protected semver tags, after tests and manual review; provenance, SBOM,
   signed artifacts via a documented mechanism.
9. Site build and GitHub Pages deploy on `main` after site tests.

Use **least-privilege `GITHUB_TOKEN`**, default `contents: read`; only release/deploy jobs obtain
explicitly required write permissions. Pin third-party actions to full immutable commit SHA **after
verifying their digest**; update with Dependabot. Do not copy arbitrary/unverified SHA values from
plans. No untrusted PR code may receive deploy, package publication or financial secrets. Avoid
`pull_request_target` combined with checking out untrusted contributions. Protect GitHub
`github-pages` environment; avoid shell interpolation of untrusted issue/PR text; control
concurrency and use lockfile-based frozen installs. Document usage quotas and fork-safe behavior. No
unconditional publish from every PR.

### GitHub Pages workflow outline (illustrative, validate pinned actions)

```yaml
name: Pages
on:
  push:
    branches: [main]
    paths: ['apps/website/**', '.github/workflows/pages.yml']
  workflow_dispatch:
permissions:
  contents: read
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@<VERIFIED_FULL_COMMIT_SHA>
      - name: Install runtime and dependencies
        run: echo 'Replace with pinned toolchain setup and pnpm install --frozen-lockfile'
      - name: Build static site
        run: echo 'Replace with verified site build script'
      - name: Upload pages artifact
        uses: actions/upload-pages-artifact@<VERIFIED_FULL_COMMIT_SHA>
        with:
          path: apps/website/dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - id: deployment
        uses: actions/deploy-pages@<VERIFIED_FULL_COMMIT_SHA>
```

**This is deliberately a non-runnable planning scaffold** until verified actions, build steps and
dependencies are filled. Replace placeholders before implementation and, use published supported
major versions and pin full SHA; build should fail if output doesn't exist. GitHub Pages repository
path: `https://<owner>.github.io/<repository>/` **only after** the owner, repository slug and Pages
deployment are verified. Account and repo spelling and availability must be verified.
`base: '/<repository>/'` for static assets if required. GitHub Pages hosts static HTML/CSS/JS, **not
the Core API**; don't put RPC keys, HMAC keys or private merchant data in it.

Official GitHub Pages docs:
https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## 10. Landing page / docs / SEO

A clean accessible, mobile-friendly, English-only static site, light by default, with an optional
dark theme, no unnecessary scripts, no third-party tracking by default. Proposed sections:

1. Hero: `Self-hosted crypto payments, built for developers.` + `View on GitHub`, `Documentation`,
   `Try Testnet Demo` (only if working).
2. Clear _Testnet / Experimental_ badge; never hide risks.
3. Value proposition: merchant-controlled infrastructure, receive-only design, multi-framework API,
   verifiable source. Label future support as roadmap.
4. Architecture diagram with wallet / merchant-hosted Core / RPC.
5. Verified quickstart snippet copied from real running example.
6. Supported chains and framework SDKs **only if tested**, roadmap below.
7. Security & trust: limitations, threat model, disclosure, version/audit status.
8. Benchmarks with methodology or no comparison metrics.
9. Roadmap and `good first issue` contributions.
10. `Support development` area with donation link and transparency policy.
11. Footer with maintainer attribution, license, GitHub, changelog and legal disclaimer.

Use responsive design, keyboard navigation, semantic HTML, descriptive labels, contrast checks,
sitemap, robots.txt, canonical URL, OG/Twitter images, page title and description, optimized static
assets, no fake testimonials, no fabricated metrics. Privacy-friendly analytics only if explicitly
opted in by maintainer with policy. Avoid Google indexing of sensitive staging installations. Add a
GitHub Pages deployed link to repository **About → Website** and README. Future custom domain
optional, not required.

## 11. README.md — required structure and claims policy

Public README must be English, concise, credible and maintained. The detailed engineering
specification stays in DEVELOP.md. Required outline:

```markdown
# PayFreo

[real CI badge] [license badge] [actual release badge]

> Lightweight, self-hosted crypto payment infrastructure. (Design goal)

**Status: Experimental — Testnet Only — NOT FOR REAL FUNDS**

## Why this project?

## Implemented features (verified, with links)

## Planned features (clearly separate)

## How it works / trust assumptions

## Installation prerequisites

## 5-minute quickstart (only after independently timed and reproduced)

## API / SDK example (must actually work)

## Supported networks & tokens (exact contracts/version)

## Security warnings & limitations

## Architecture & documentation

## Tests / reproducibility

## Roadmap

## Contributing / good first issues

## Funding / sponsor transparency

## Licenses / trademark / disclaimer

## Maintainers / acknowledgments
```

Do not say `audited`, `no fees`, `guaranteed`, `fully secure`, `no trust required`,
`production-ready`, `unbreakable` or `supported framework` unless precisely true and supported by
linked proof. Platform fee-free means **no fee deducted by PayFreo**, not zero gas/RPC/server costs.
`Non-custodial` means no merchant secret control, not that a manipulated payment UI poses zero theft
risk. Every README command must be verified in CI or manually recorded. Use clear links and avoid
giant badge walls.

## 12. Funding, crypto donations and bounty payments

### Donation channels and transparency

- Provide a dedicated static `Support development` page. Merchant customer payments must be separate
  from maintainer donation addresses and never diverted to them.
- Use `.github/FUNDING.yml` with `custom: ['https://<owner>.github.io/<repository>/support/']`
  **only after the real site and link are operational**. GitHub supports custom funding URLs, up to
  four; do not add a `github:` Sponsors account unless eligible and activated.
- Donations can be offered as one-off stablecoin/crypto transfers on carefully verified networks. Do
  **not** invent wallet addresses in code; maintainer must explicitly provide and verify addresses,
  network, token contract, checksum and test receipt. No automatic approval, unlimited allowance,
  wallet-draining signature or mandatory smart contract. Show chain, token, address and
  irreversible-transfer warning; QR text must exactly match human-readable address. Provide copy and
  independent explorer verification.
- Public `FUNDING_POLICY.md`: voluntary nature, no promised return or equity, intended budget,
  operator identity/contact, handling of anonymous gifts, transaction fee policy, accounting
  methodology, donation receipt limitations, prohibited sources/sanctions screening and conflict
  process. Publish periodic aggregate accounting without doxxing donors. Donation does not buy
  security-review priority or governance control.
- Treat donations, cross-border crypto payments and bounty disbursements as **legally gated**
  actions for a maintainer resident in Iran. Validate sanctions/counterparties, local laws and taxes
  before any real transfers. Never promise payouts prior to lawful funding availability.

### Community bounty program

- Initially accept volunteer contributions and public `bounty:proposed` issues **without monetary
  promise**.
- Once eligible, legally reviewed and funded, allocate budget (illustrative **40% contribution
  bounties, 30% maintainer work, 20% independent security, 10% infra**; actual percentages must be
  clearly approved and disclosed; this is not an automatic on-chain contract).
- `BOUNTY_POLICY.md`: scope, deliverables, acceptance criteria, payout currency/network, fixed
  amount, funding source, review SLA only if realistically enforceable, claimant assignment,
  anti-spam, taxes, sanctions/KYC where legally required, appeals, conflicts, cancellation policy,
  failed-wallet transfer handling and contributor confidentiality. No retroactive payout promises.
- States:
  `proposed → approved/funded → assigned → PR → reviewed → accepted → eligible-to-pay → paid` with
  corresponding issue labels and transparent evidence; `paid` only after on-chain verification and
  compliance. Bounty claims do not override code-review rigor; never reward vulnerability disclosure
  through public issues.
- Bounty reward is for **accepted work**, not commit count or code volume. Security findings handled
  privately with a separate policy.
- Give contributors attribution and clear opt-in consent for displaying pseudonyms/addresses; no
  forced publication of personal identities.
- Consider support organizations or compliant fiscal sponsors only if permitted and available, not
  assume access.

## 13. Security operations and dependency governance

- Document abuse cases: recipient substitution, malicious SDK/dependency, supply-chain compromise,
  spoofed events, RPC censorship/misreporting, duplicate fulfillment, compromised webhook
  destination, database manipulation, signing phishing, social engineering, miner extractable issues
  and chain reorg.
- `THREAT_MODEL.md`: assets, attackers, trust boundaries, privileged operations, assumptions,
  vulnerabilities, controls, residual risks and owner.
- Secret scanning and `.gitignore` coverage; immediately revoke accidentally exposed secrets and
  preserve incident evidence rather than just deleting Git history.
- Dependency locking, CI reproducibility, vulnerability patches, CVE triage, signed releases and
  SBOM. No dynamic `curl | sh` blind install as sole supported method.
- `SECURITY.md`: supported versions, private vulnerability reporting, embargo protocol, response
  expectations with no unrealistic guarantees. Avoid publishing PoCs until fixes are available.
- `docs/INCIDENT_RESPONSE.md`: disable new invoices, prevent erroneous fulfillment, communicate
  scope, restore from backup, rotate HMAC/API secrets, forensic preservation and disclosure.
- No private-key material stored, including future escrow/governance signing keys; contract
  interactions initiated by merchant or partner wallet.
- For future contracts, use OpenZeppelin primitives where compatible, pinned dependencies, NatSpec,
  invariants, Foundry fuzz/invariant testing, Slither and independent audits. Security audit
  scope/version/hash must be disclosed, including unresolved findings.

## 14. Definition of done — per feature and release

A feature is done only if: coded, input validated, threat-model impact reviewed, error conditions
handled, unit/integration tests run, documentation/examples updated, changelog updated when
relevant, CI green on actual run, no secrets or prohibited data, licenses respected, and at least
one reviewer has reviewed security-sensitive changes. A test omitted is **NOT RUN**, not PASS.
Technical debt must be filed as explicit issues. A **release** also needs reproducible artifacts,
migration notes, security/risk disclosure and smoke test in a fresh environment.

Before each public release, output this report:

```text
Version / tag / commit:
Changes:
Files changed:
Dependency changes:
Tests PASS / FAIL / NOT RUN (commands + outputs):
Security checks PASS / FAIL / NOT RUN:
Operational smoke test:
Supported platforms actually checked:
Known limitations / vulnerabilities:
User-impacting or breaking changes:
Documentation / license updates:
Deployment / Pages status (verified URL only):
Funding links status (verified only):
Next milestones:
```

## 15. Development milestones

### Foundation: Repository standards (current milestone)

Normalize README and DEVELOP, apply PayFreo branding, maintain English contributor guidance, pin
repository formatting tools, exclude `agent/`, and define formatting CI. **Acceptance:** formatter
passes, public file links resolve, future files are clearly marked as planned, and local working
files are excluded from staging. Report Git-dependent checks as NOT RUN if a valid writable
repository is unavailable; do not delete or replace protected Git metadata to make a check pass.

### Delivery order and completion gates

| Milestone                                      | Deliverable                                                               | Acceptance                                                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Foundation                                     | Repository standards and formatting                                       | Local formatting and documentation checks pass; Git exclusions verified when a repository is available |
| Discovery (Task 0)                             | Benchmark, scope, attribution decision, threat model, licensing questions | Evidence and unresolved decisions recorded; no invented approvals                                      |
| Core skeleton (Task 1)                         | Fastify service, configuration, SQLite, health, Docker, tests             | Clean bootstrap, actionable configuration errors, passing checks                                       |
| Payment MVP (Task 2)                           | Invoice API, verifier, atomic attribution, reconciliation, webhooks       | Deterministic local tests, including race/replay/reorg and ambiguous-payment rejection                 |
| Integration and project operations (Tasks 3–4) | TS SDK, checkout example, contributor and release tooling                 | End-to-end testnet demo and fork-safe CI; release dry run                                              |
| Public presentation (Task 5)                   | Static docs and support information                                       | Verified site and links; donation destinations only after activation requirements are met              |
| Expansion (Task 6 and Tasks 7+)                | Demand-driven SDKs and separately reviewed contracts                      | Shared SDK conformance; independent contract-specific design and security gates                        |

Detailed working checklists belong in ignored `agent/plans/`. The public roadmap and release gates
remain here. No milestone has a fixed delivery date. Discovery must resolve the attribution design
before payment implementation; legal, licensing, and production approvals are not implied by this
foundation work.

### Publication checkpoints

The public repository is [mahdifarshid/payfreo](https://github.com/mahdifarshid/payfreo). No
deployment is claimed to exist yet.

1. **Public planning repository:** after the foundation is reviewed, establish a valid Git
   repository, confirm the license terms for the material being published, inspect the complete
   staged file list, and verify that local configuration and working notes are excluded. This is the
   first appropriate point to publish under `github.com/mahdifarshid`, with the planning/testnet
   status visible. A working payment engine is not required for a clearly labeled planning
   repository.
2. **Initial code release:** after the Core and reference SDK satisfy their tests, publish the
   reproducible quickstart, supported configurations, limitations, and actual CI evidence. Do not
   describe a repository publication as production readiness.
3. **Documentation website:** implement the static site in Task 5, build and check it locally, then
   configure Settings → Pages → GitHub Actions. Use the project's default `github.io` address; no
   domain purchase or `CNAME` file is required. If the repository slug is `payfreo`, the intended
   site URL is `https://mahdifarshid.github.io/payfreo/` and its base path is `/payfreo/`. Confirm
   the final repository spelling, HTTPS URL, assets, and internal links after deployment before
   adding a live link to README and the repository About section.
4. **Sponsorship activation:** add live support links only after the support page, receiving
   details, and existing funding prerequisites have been verified.

At each milestone, report whether the next publication checkpoint is ready and list only the
remaining concrete actions. Repository creation, publication, and Pages deployment are separate
actions from local implementation. Do not publish automatically merely because a milestone passes.

GitHub Pages supports static project sites in public repositories on GitHub Free and provides a
default `github.io` URL. See the
[official GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
The website hosts documentation and project information; the Core remains merchant-operated.

### Task 0: Repository preparation and discovery

Inspect Git repo, confirm `mahdifarshid` account and naming feasibility (when accessible), benchmark
competitors with dated reproducible results, choose license after legal/compatibility review, create
`docs/ADR/0001-scope.md`, `docs/THREAT_MODEL.md` draft, and an issue board. Never claim an invented
GitHub repo exists. **Acceptance:** documented research, explicit MVP payment-attribution design
decision, no external money moves.

### Task 1: Minimal development skeleton

Create pnpm workspace, core app, typed config/runtime schema, health endpoints, SQLite adapter and
migrations, lint/typecheck/tests, Dockerfile/Compose, env template, base CI and English README.
**Acceptance:** clean clone/bootstrap/build/tests pass; empty config errors are actionable; no
default sensitive keys; server runs locally.

### Task 2: Testnet payment verification

Write OpenAPI contract and robust invoice state machine; establish deterministic Anvil fixtures and
test ERC-20; implement strict ERC-20 verification, atomic event attribution, durable reconciling,
idempotency, safe expiry and finality handling per approved RFC. **Acceptance:** all
negative/race/replay tests pass; no ambiguous invoices marked paid.

### Task 3: TS SDK and demo

Generate/implement TypeScript client from OpenAPI; create minimal server-side Node/NestJS example
with safe API key handling; checkout example requests a transaction in wallet with visible
token/chain/destination and waits for verified invoice status. **Acceptance:** first testnet payment
demo works end to end; no merchant API key in browser; real documented commands.

### Task 4: Open-source operational quality

CI, PR templates, issue forms, contributing, license files, branch/tag protection instructions,
Dependabot, security policy and CHANGELOG. **Acceptance:** PR from fork runs unprivileged tests and
cannot publish artifacts or access secrets; proper versioned tag/release verified in a test dry-run.

### Task 5: Free GitHub Pages landing

Build simple responsive site, docs, security limitations and _future_ funding page with no invented
payment addresses. Enable Actions-based Pages deployment, confirm correct path base and real URL,
insert into README/About. **Acceptance:** publicly reachable page with working internal links and no
secrets.

### Task 6: SDK expansion and community launch

Only after actual users validate the core: PHP/Laravel SDK, Python SDK/FastAPI/Django examples, then
Go/Rust. OpenAPI conformance suite, version negotiation, real usage feedback; fund and pay bounties
only after legal eligibility and budget verification. **Acceptance:** each SDK independently
installs, passes conformance tests and has a runnable example.

### Tasks 7+: Contracts (separate RFCs and security gates)

Fixed-share consortium first, governance second, escrow last. Do not merge experimental contracts
into safe core claims. Do not use real funds during development without approved security and legal
milestones.

## 16. Project marketing strategy

- Segment 1: Backend developers who want **a narrow stablecoin payments API** without using a
  third-party custodian.
- Segment 2: SaaS founders who need independently verifiable settlement.
- Segment 3 (future): Open-source apps and service marketplaces seeking consortium/escrow features
  after audits.
- 0–30 days: speak with ~15 relevant developers, record objections, ship a transparent benchmark and
  working testnet quickstart.
- 31–60 days: publish quality tutorial(s) — e.g. `How to verify an ERC-20 payment in NestJS` and
  `Laravel stablecoin payments with a self-hosted core`. Show real code, no misleading marketing
  claims.
- 61–90 days: launch on relevant communities such as DEV, Show HN and appropriate Reddit communities
  according to their rules; publish changelog, issue triage, FAQ and a roadmap. No mass unsolicited
  messages or fake accounts/stars.
- Metrics: fresh-clone setup success, time to verified testnet invoice, installation failure rate,
  docs search issues, reproducible tests, active outside contributors, first independent projects
  and security disclosures handled. Stars are supporting signals, not proof of adoption or revenue.
- Sponsor appeal: publish transparent funds policy, public release cadence, funding needs tied to
  independently verifiable work; do not promise monetary ROI to donors.

## 17. References to verify at implementation time

- GitHub Pages custom workflows:
  https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- GitHub Pages publishing source:
  https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Repository FUNDING.yml:
  https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/displaying-a-sponsor-button-in-your-repository
- GitHub repository rulesets:
  https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository
- OpenZeppelin Contracts: https://docs.openzeppelin.com/contracts
- OpenZeppelin security guidance: https://www.openzeppelin.com/faqs/securing-onchain-systems
- OWASP CI/repository hardening:
  https://owasp.github.io/DevSecOpsGuideline/2-Process/2-2-Develop/2-2-1-Pre-commit/2-2-1-4-Repository-Hardening/
- SPDX license identifiers: https://spdx.org/licenses/
- GNU AGPLv3: https://www.gnu.org/licenses/agpl-3.0.en.html
- Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0
- MPL 2.0: https://www.mozilla.org/en-US/MPL/2.0/
- GitHub public repository license guide:
  https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository

---

## Release principles

**Build a credible, test-driven, transparent public project—not a prototype that makes production
financial promises.** Start with discovery and a focused testnet MVP. Preserve merchant autonomy,
clear payout attribution, maintainable SDK contracts, accurate Git history, public security
practices and honest documentation. Ask for actual wallet addresses and legally permitted
funding/payout terms only when those features are implemented and their prerequisites are satisfied.
Stop and report blockers rather than silently weakening security.
