import 'reflect-metadata';
import { createApplication } from './application';
import { parseConfig } from './config/core-config';

async function main(): Promise<void> {
  const config = parseConfig(process.env);
  const app = await createApplication();
  await app.listen(config.PORT, config.HOST);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown startup failure';
  console.error(message);
  process.exitCode = 1;
});
