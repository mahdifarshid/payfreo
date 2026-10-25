import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseConfig } from '../src/config/core-config';

test('accepts a local SQLite URL and safe listener defaults', () => {
  const config = parseConfig({ DATABASE_URL: 'file:./payfreo.sqlite' });
  assert.equal(config.HOST, '127.0.0.1');
  assert.equal(config.PORT, 3000);
});

test('rejects missing or unsupported database configuration', () => {
  assert.throws(() => parseConfig({}), /DATABASE_URL/);
  assert.throws(() => parseConfig({ DATABASE_URL: 'postgresql://localhost/payfreo' }), /SQLite/);
});

test('rejects invalid listener ports', () => {
  assert.throws(
    () => parseConfig({ DATABASE_URL: 'file:./payfreo.sqlite', PORT: '65536' }),
    /PORT/,
  );
});
