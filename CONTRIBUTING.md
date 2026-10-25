# Contributing to PayFreo

PayFreo is at the repository foundation stage. The payment engine, SDKs, contracts, and deployment
instructions are planned. Read [README.md](README.md) for current status and
[DEVELOP.md](DEVELOP.md) for scope, security constraints, and the development sequence.

## Local tooling

Use Node.js **24 LTS** for primary development; `.node-version` pins **24.22.1**. Node.js **22.13.0
or newer within 22.x** is also a compatibility target. Use pnpm **11.10.0** on both release lines.
The pnpm requirement determines the minimum Node.js 22 version. Odd-numbered and other Node.js
release lines are not included in the supported engine range.

CI checks the pinned Node.js **22.22.1** and **24.22.1** versions. When source code is introduced,
run lint, type checks, builds, and runtime tests on both lines before claiming application
compatibility. The root package is private and is not a published PayFreo SDK.

With the pinned tools available, run from the repository root:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm format
pnpm format:check
```

Use the local Prettier version from `node_modules`, including in your editor. Do not use an unpinned
global formatter. Commit dependency changes together with `pnpm-lock.yaml`. Do not hand-edit the
generated lockfile. Toolchain updates must keep the package manifest, `.node-version`, CI, and this
guide consistent.

Formatting uses UTF-8, LF, a final newline, two spaces, a 100-character preferred print width,
semicolons, single quotes, and trailing commas. Markdown hard breaks are preserved. Tables, URLs,
and other formatter-managed constructs may exceed the preferred width.

## Language and organization

- Write all documentation, comments, commit messages, PR descriptions, and contributor-facing text
  in English. Use clear identifiers and explain non-obvious decisions in comments.
- Use `kebab-case` for new source files and directories, `camelCase` for functions and variables,
  `PascalCase` for types and classes, and `UPPER_SNAKE_CASE` for constants. Follow ecosystem
  conventions when additional languages are introduced. Root policy documents use conventional
  uppercase names, such as `README.md`.
- Keep HTTP handling, domain logic, persistence, and blockchain access separate. SDKs consume the
  shared API contract; they must not duplicate payment verification.
- Create directories only when needed. The intended layout is documented in DEVELOP; do not add
  empty SDKs, placeholder services, or speculative abstractions.
- Keep README concise and accurate. Maintain detailed requirements and the public roadmap in
  DEVELOP. Add public architecture decisions under `docs/ADR/` when decisions are made.
- Update documentation alongside behavior changes. Mark future documents and features as planned; do
  not add links to files, releases, or hosted services that do not exist.

## Local working files

Preserve existing local tool configuration in place. Ignore it rather than deleting, moving,
renaming, or rewriting it during repository cleanup. Local configuration is not disposable scratch
output.

Create `agent/plans/`, `agent/reports/`, and `agent/notes/` locally as needed. The root `agent/`
directory is ignored by Git and Prettier. It holds temporary plans, raw research, execution logs,
scratch scripts, screenshots, and handoff notes. Never force-add its contents or place these files
elsewhere in the public tree. Ignoring a path is not access control; do not put secrets in reports.

Maintained specifications, architecture decisions, contributor instructions, and reproducible public
test evidence belong in public project documentation, regardless of who writes them. Public
documentation and builds must not depend on `agent/`. When linters, build tools, or container
contexts are added, explicitly exclude `agent/` from their inputs.

Before staging, inspect `git status --short` and `git diff`. Verify local working files are
excluded:

```sh
git check-ignore -v agent/plans/example.md agent/reports/example.md agent/notes/example.md
git add --dry-run .
git ls-files agent/
```

The first command should identify `/agent/` in `.gitignore`; the dry run must not list local working
files; the last command must return no tracked files. Ignore rules do not untrack existing files. If
Git is unavailable, report these checks as **NOT RUN** and resolve the environment before staging.

## Changes and review

Use short-lived branches such as `docs/repository-standards` or `feat/invoice-verification` and
Conventional Commits, for example `docs: clarify development milestones` or
`chore: configure repository formatting`. Keep changes focused; avoid unrelated rewrites.

Before submitting a PR:

1. Read the relevant requirements and record a small local plan when needed.
2. Implement the smallest coherent change and update the maintained documentation.
3. Run `pnpm format:check` and the checks appropriate to the change.
4. Review the diff for accidental artifacts, credentials, and unsupported claims.
5. Describe the problem, resulting behavior, and validation. Report checks as PASS, FAIL, or NOT RUN
   with commands and material limitations. Keep raw execution logs in `agent/reports/`.

The foundation CI checks formatting only. ESLint, TypeScript checks, builds, and meaningful runtime
tests are added with the first source modules; do not create scripts that pretend those checks pass.
Require human review for security-sensitive payment changes. Do not weaken validation or silently
skip a required test to make CI green.

## Security, funding, and licensing

Development remains local/testnet only. Do not use merchant keys, real funds, production wallets, or
live donation transfers in tests. No withdrawal signing, custody, or hidden maintainer fee belongs
in the initial Core.

Do not publish private vulnerability details in public issues. A verified private reporting channel
and `SECURITY.md` must be established before a public code release; no reporting SLA is promised
yet.

Funding and licensing remain provisional as described in DEVELOP. Do not invent donation addresses,
activated sponsor accounts, bounty commitments, license approvals, or audit evidence. Establish the
applicable license and contribution terms before accepting code contributions for public release.
