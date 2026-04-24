import { buildApp } from "./app";
import { env } from "./config/env";

async function main() {
  const app = await buildApp();
  try {
    await app.listen({ port: env.API_PORT, host: env.API_HOST });
    app.log.info(`API listening on http://${env.API_HOST}:${env.API_PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void main();
