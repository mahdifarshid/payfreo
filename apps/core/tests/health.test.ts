import 'reflect-metadata';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { after, test } from 'node:test';
import { ServiceUnavailableException } from '@nestjs/common';
import { createApplication } from '../src/application';
import { DatabaseService } from '../src/database/database.service';
import { HealthController } from '../src/health/health.controller';
import { HealthService } from '../src/health/health.service';

const directory = mkdtempSync(join(tmpdir(), 'payfreo-core-test-'));
const databaseUrl = `file:${join(directory, 'core.sqlite')}`;
process.env.DATABASE_URL = databaseUrl;

after(() => rmSync(directory, { recursive: true, force: true }));

test('Nest application initializes with the health controller', async () => {
  const app = await createApplication();
  try {
    assert.deepEqual(app.get(HealthService).live(), { status: 'ok' });
  } finally {
    await app.close();
  }
});

test('liveness is independent of storage and readiness requires a migration', async () => {
  const database = new DatabaseService();
  const health = new HealthController(new HealthService(database));
  const coreDirectory = resolve(__dirname, '../..');

  try {
    assert.deepEqual(health.live(), { status: 'ok' });
    await assert.rejects(
      () => health.ready(),
      (error: unknown) => error instanceof ServiceUnavailableException && error.getStatus() === 503,
    );

    const migrationsDirectory = join(coreDirectory, 'prisma/migrations');
    const initialMigration = readdirSync(migrationsDirectory).find((name) =>
      name.endsWith('_initial'),
    );
    assert.ok(initialMigration);
    const sql = readFileSync(join(migrationsDirectory, initialMigration, 'migration.sql'), 'utf8');
    await database.$executeRawUnsafe(sql);

    await assert.rejects(
      () => health.ready(),
      (error: unknown) => error instanceof ServiceUnavailableException,
    );

    await database.$executeRawUnsafe(`
      CREATE TABLE "_prisma_migrations" (
        "migration_name" TEXT NOT NULL,
        "finished_at" DATETIME,
        "rolled_back_at" DATETIME
      )
    `);
    await database.$executeRaw`
      INSERT INTO _prisma_migrations (migration_name, finished_at, rolled_back_at)
      VALUES (${initialMigration}, CURRENT_TIMESTAMP, NULL)
    `;

    assert.deepEqual(await health.ready(), { status: 'ready' });
  } finally {
    await database.$disconnect();
  }
});
