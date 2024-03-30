import { Global, Module } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { CrawlerService } from '@crawler/crawler.service';
import { CrawlerCommand } from '@crawler/crawler.command';
import { CrawlerHandlerContext } from '@crawler/crawler-handler-context';
import { CrawlerGlisshopHandler } from '@crawler/handlers/crawler-glisshop-handler';
import { CrawlerXspoHandler } from '@crawler/handlers/crawler-xspo-handler';
import { CrawlerEasyGlissHandler } from '@crawler/handlers/crawler-easy-gliss-handler';
import { CrawlerHandler } from '@crawler/crawler-handler.interface';
import { CrawlerSnowLeaderHandler } from '@crawler/handlers/crawler-snowleader-handler';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    CrawlerCommand,
    PinoLogger,
    CrawlerGlisshopHandler,
    CrawlerXspoHandler,
    CrawlerEasyGlissHandler,
    CrawlerSnowLeaderHandler,
    CrawlerHandlerContext,
    {
      provide: 'CRAWLER_HANDLERS',
      useFactory: (...handles: CrawlerHandler[]) => {
        return handles;
      },
      inject: [
        CrawlerGlisshopHandler,
        CrawlerXspoHandler,
        CrawlerEasyGlissHandler,
        CrawlerSnowLeaderHandler,
      ],
    },
    CrawlerService,
  ],
  exports: [CrawlerCommand, 'CRAWLER_HANDLERS', CrawlerHandlerContext],
})
export class CrawlerModule {}
