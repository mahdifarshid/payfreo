import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { DatabaseReadiness } from './database-readiness';

type AppliedMigration = {
  migration_name: string;
  finished_at: Date | null;
  rolled_back_at: Date | null;
};

@Injectable()
export class DatabaseService extends PrismaClient implements DatabaseReadiness, OnModuleDestroy {
  async isReady(): Promise<boolean> {
    // Compiled application and test output place this module at different depths.
    const runtimeDirectory = resolve(__dirname, '../../prisma/migrations');
    const migrationsDirectory = existsSync(runtimeDirectory)
      ? runtimeDirectory
      : resolve(__dirname, '../../../prisma/migrations');
    const migrations = readdirSync(migrationsDirectory).filter((name) =>
      statSync(join(migrationsDirectory, name)).isDirectory(),
    );

    if (migrations.length === 0) {
      return false;
    }

    const applied = await this.$queryRaw<AppliedMigration[]>`
      SELECT migration_name, finished_at, rolled_back_at FROM _prisma_migrations
    `;
    const completed = new Set(
      applied
        .filter((migration) => migration.finished_at !== null && migration.rolled_back_at === null)
        .map((migration) => migration.migration_name),
    );

    if (!migrations.every((migration) => completed.has(migration))) {
      return false;
    }

    await this.coreMetadata.count();
    return true;
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
