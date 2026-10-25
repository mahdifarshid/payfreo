import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { DATABASE_READINESS, type DatabaseReadiness } from '../database/database-readiness';

@Injectable()
export class HealthService {
  constructor(@Inject(DATABASE_READINESS) private readonly database: DatabaseReadiness) {}

  live(): { status: 'ok' } {
    // Liveness reports process availability even while storage is unavailable.
    return { status: 'ok' };
  }

  async ready(): Promise<{ status: 'ready' }> {
    try {
      if (await this.database.isReady()) {
        return { status: 'ready' };
      }
    } catch {
      // Never expose database details through the public health endpoint.
    }

    throw new ServiceUnavailableException({ status: 'unavailable' });
  }
}
