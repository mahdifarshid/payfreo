export const DATABASE_READINESS = Symbol('DATABASE_READINESS');

/** Only the capability needed by health checks crosses the persistence module boundary. */
export interface DatabaseReadiness {
  isReady(): Promise<boolean>;
}
