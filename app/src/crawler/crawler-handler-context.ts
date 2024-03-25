import { Inject, Injectable } from '@nestjs/common';
import { PlaywrightCrawler } from 'crawlee';
import { CrawlerHandler } from '@crawler/crawler-handler.interface';

@Injectable()
export class CrawlerHandlerContext {
  constructor(
    @Inject('CRAWLER_HANDLERS') private readonly handlers: CrawlerHandler[],
  ) {}

  async handle(href: string): Promise<PlaywrightCrawler> {
    for (const handler of this.handlers) {
      if (handler.support(href)) {
        return handler.handle(href);
      }
    }
  }
}
