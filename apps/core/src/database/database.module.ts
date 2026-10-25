import { Module } from '@nestjs/common';
import { DATABASE_READINESS } from './database-readiness';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService, { provide: DATABASE_READINESS, useExisting: DatabaseService }],
  exports: [DATABASE_READINESS],
})
export class DatabaseModule {}
