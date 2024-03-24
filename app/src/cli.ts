import { CommandFactory } from 'nest-commander';
// import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

async function bootstrap() {
  await CommandFactory.run(AppModule);
}

bootstrap()
  .then(async (app) => {
    console.info(`${app} command bootstrapped ...!`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(`server failed to start command`, err);
    process.exit(1);
  });
