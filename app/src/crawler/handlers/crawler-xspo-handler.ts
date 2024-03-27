import { Injectable } from '@nestjs/common';
import { PlaywrightCrawler } from 'crawlee';
import { CRAWLER_XSPO_HOSTNAME } from '@src/crawler/handlers/crawler-source-hostname';
import UrlValidator from '@src/utils/url-validator';
import { CrawlerHandler } from '@crawler/crawler-handler.interface';
import { CrawlerItem } from '@crawler/crawler-item.interface';
import { Logger } from 'nestjs-pino';

@Injectable()
export class CrawlerXspoHandler implements CrawlerHandler {
  constructor(private readonly logger: Logger) {}

  support(href: string): boolean {
    const urlValidator: UrlValidator = new UrlValidator(href);

    return (
      urlValidator.isValid() &&
      urlValidator.getHostName() === CRAWLER_XSPO_HOSTNAME
    );
  }

  handle(): PlaywrightCrawler {
    return new PlaywrightCrawler({
      requestHandler: async ({ request, page, enqueueLinks }) => {
        if (request.label === 'DETAIL') {
          const title = await page.title();
          const item = {
            title,
            url: request.loadedUrl,
          } as CrawlerItem;

          if (request.loadedUrl?.includes('alpine-ski-boots')) {
            item.brand = await page
              .locator('.product-details .title > a')
              .textContent();

            item.productName = await page.locator('h1.title').textContent();

            item.originPrice = 1;

            item.salePrice = 1;

            item.currency = 'EUR';

            this.logger.log(item);
          }

          // Save results as JSON to ./storage/datasets/default
          // await Dataset.pushData(item);
        } else {
          // Extract links from the current page
          // and add them to the crawling queue.
          await enqueueLinks({
            selector: '.product-hover > a',
            label: 'DETAIL',
          });

          await enqueueLinks({
            selector: '.bottom-pagination > a',
            label: 'LIST',
          });
        }
      },
    });
  }
}
