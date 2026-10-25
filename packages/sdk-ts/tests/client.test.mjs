import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PayFreoClient, PayFreoHttpError, PayFreoProtocolError } from '../dist/index.js';

test('requests both health endpoints under a base path', async () => {
  const requests = [];
  const client = new PayFreoClient({
    baseUrl: 'https://merchant.example/core',
    fetch: async (url, init) => {
      requests.push({ url: url.href, method: init.method, accept: init.headers.accept });
      const status = url.pathname.endsWith('/ready') ? 'ready' : 'ok';
      return globalThis.Response.json({ status });
    },
  });

  assert.deepEqual(await client.live(), { status: 'ok' });
  assert.deepEqual(await client.ready(), { status: 'ready' });
  assert.deepEqual(requests, [
    { url: 'https://merchant.example/core/health/live', method: 'GET', accept: 'application/json' },
    {
      url: 'https://merchant.example/core/health/ready',
      method: 'GET',
      accept: 'application/json',
    },
  ]);
});

test('reports an unavailable Core without treating it as ready', async () => {
  const client = new PayFreoClient({
    baseUrl: 'http://127.0.0.1:3000',
    fetch: async () => globalThis.Response.json({ status: 'unavailable' }, { status: 503 }),
  });

  await assert.rejects(client.ready(), (error) => {
    assert.ok(error instanceof PayFreoHttpError);
    assert.equal(error.status, 503);
    return true;
  });
});

test('rejects unexpected or malformed success responses', async () => {
  for (const body of ['{"status":"paid"}', 'not-json']) {
    const client = new PayFreoClient({
      baseUrl: 'https://merchant.example',
      fetch: async () => new globalThis.Response(body, { status: 200 }),
    });

    await assert.rejects(client.live(), PayFreoProtocolError);
  }
});

test('rejects unsafe base URLs and invalid timeouts', () => {
  for (const baseUrl of [
    'file:///tmp/core',
    'https://user:secret@merchant.example',
    'https://merchant.example?token=secret',
    'https://merchant.example/#section',
  ]) {
    assert.throws(() => new PayFreoClient({ baseUrl }), TypeError);
  }

  for (const timeoutMs of [0, -1, 1.5, Number.POSITIVE_INFINITY]) {
    assert.throws(
      () => new PayFreoClient({ baseUrl: 'https://merchant.example', timeoutMs }),
      RangeError,
    );
  }
});

test('passes the configured timeout to fetch', async () => {
  const client = new PayFreoClient({
    baseUrl: 'https://merchant.example',
    timeoutMs: 10,
    fetch: async (_url, init) => {
      await new Promise((resolve, reject) => {
        const guard = globalThis.setTimeout(
          () => reject(new Error('Timed out waiting for abort')),
          200,
        );
        init.signal.addEventListener(
          'abort',
          () => {
            globalThis.clearTimeout(guard);
            reject(init.signal.reason);
          },
          { once: true },
        );
      });
      return globalThis.Response.json({ status: 'ok' });
    },
  });

  await assert.rejects(client.live(), { name: 'TimeoutError' });
});
