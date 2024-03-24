import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlerModule } from './crawler/crawler.module';
import { LoggerModule } from 'nestjs-pino';
import { CrawlerCommand } from './crawler/crawler.command';
import { CrawlerService } from './crawler/crawler.service';

@Module({
  imports: [LoggerModule.forRoot(), CrawlerModule],
  controllers: [AppController],
  providers: [AppService, CrawlerCommand, CrawlerService],
})
export class AppModule {}
