import { Global, Module } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { CrawlerService } from '@crawler/crawler.service';
import { CrawlerCommand } from '@crawler/crawler.command';
import { CrawlerHandlerContext } from '@crawler/crawler-handler-context';
import { CrawlerGlisshopHandler } from '@crawler/handlers/crawler-glisshop-handler';
import { CrawlerXspoHandler } from '@crawler/handlers/crawler-xspo-handler';
import { CrawlerEasyGlissHandler } from '@crawler/handlers/crawler-easy-gliss-handler';
import { CrawlerHandler } from '@crawler/crawler-handler.interface';

@Global()
@Module({
  providers: [
    CrawlerCommand,
    PinoLogger,
    CrawlerGlisshopHandler,
    CrawlerXspoHandler,
    CrawlerEasyGlissHandler,
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
      ],
    },
    CrawlerService,
  ],
  exports: [CrawlerCommand, 'CRAWLER_HANDLERS', CrawlerHandlerContext],
})
export class CrawlerModule {}
