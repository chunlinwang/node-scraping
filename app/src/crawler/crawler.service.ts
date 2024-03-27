import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { CrawlerHandlerContext } from '@crawler/crawler-handler-context';

@Injectable()
export class CrawlerService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly crawlerHandlerContext: CrawlerHandlerContext,
  ) {
    this.logger.setContext(CrawlerService.name);
  }

  async queryRequests(urls: string[]): Promise<void> {
    for (const url of urls) {
      const crawler = this.crawlerHandlerContext.handle(url);
      if (!crawler) {
        this.logger.error(`url ${url} is not supported.`);

        continue;
      }

      await crawler.addRequests([url]);

      await crawler.run();

      //await crawler.getDataset();
    }
  }
}
