import { CommandFactory } from 'nest-commander';
import { AppModule } from '@src/app.module';

async function bootstrap() {
  await CommandFactory.run(AppModule);
}

bootstrap()
  .then(async () => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(`server failed to start command`, err);
    process.exit(1);
  });
