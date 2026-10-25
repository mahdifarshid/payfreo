# PayFreo client (beta)

`payfreo` is a small Node.js client for the health endpoints of a merchant-hosted PayFreo Core. This
beta is for local and testnet development. It does **not** create invoices, verify transactions,
accept payments, or report payment status. Do not use real funds.

## Install

```bash
npm install payfreo@beta
```

Node.js 24 is the primary target; Node.js 22.13.0 or later on the 22.x line is also supported. The
package uses the built-in `fetch` API and has no runtime dependencies.

## Use

Start a local PayFreo Core first, then:

```js
import { PayFreoClient } from 'payfreo';

const client = new PayFreoClient({ baseUrl: 'http://127.0.0.1:3000' });

console.log(await client.live()); // { status: 'ok' }
console.log(await client.ready()); // { status: 'ready' }
```

`live()` checks whether the process responds. `ready()` checks whether the Core can query its local
database. Neither response confirms a payment. Failed HTTP responses throw `PayFreoHttpError` with a
`status` property. An unexpected response body throws `PayFreoProtocolError`. Network and timeout
errors propagate from `fetch`.

The constructor accepts an optional `timeoutMs` (default: 5000) and an optional `fetch`
implementation. The base URL must be HTTP or HTTPS and must not include credentials, query
parameters, or a fragment.

## Source and license

The source is in
[the PayFreo repository](https://github.com/mahdifarshid/payfreo/tree/main/packages/sdk-ts). This
client is licensed under Apache-2.0. The Core is a separate AGPL-3.0-only application.
