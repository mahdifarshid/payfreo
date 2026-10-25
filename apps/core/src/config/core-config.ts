import { z } from 'zod';

const configSchema = z.object({
  HOST: z.string().min(1).default('127.0.0.1'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().startsWith('file:', 'must be a SQLite file URL for this milestone'),
});

export type CoreConfig = z.infer<typeof configSchema>;

export function parseConfig(environment: NodeJS.ProcessEnv): CoreConfig {
  const result = configSchema.safeParse(environment);

  if (!result.success) {
    const problems = result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`,
    );
    throw new Error(`Invalid Core configuration: ${problems.join('; ')}`);
  }

  return result.data;
}
