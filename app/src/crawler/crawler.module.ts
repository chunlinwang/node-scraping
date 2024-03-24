import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerCommand } from './crawler.command';
import { PinoLogger } from 'nestjs-pino';

@Module({
  providers: [CrawlerService, CrawlerCommand, PinoLogger],
  exports: [CrawlerCommand],
})
export class CrawlerModule {}
