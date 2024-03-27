import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { CrawlerModule } from '@crawler/crawler.module';

@Module({
  imports: [LoggerModule.forRoot(), CrawlerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
