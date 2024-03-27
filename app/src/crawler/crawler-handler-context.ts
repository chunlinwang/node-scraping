import { Inject, Injectable } from '@nestjs/common';
import { PlaywrightCrawler } from 'crawlee';
import { CrawlerHandler } from '@crawler/crawler-handler.interface';

@Injectable()
export class CrawlerHandlerContext {
  constructor(
    @Inject('CRAWLER_HANDLERS') private readonly handlers: CrawlerHandler[],
  ) {}

  handle(href: string): PlaywrightCrawler {
    for (const handler of this.handlers) {
      if (handler.support(href)) {
        return handler.handle();
      }
    }

    return null;
  }
}
