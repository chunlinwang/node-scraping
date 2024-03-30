import { Injectable } from '@nestjs/common';
import { PlaywrightCrawler, sleep } from 'crawlee';
import { CrawlerHandler } from '@crawler/crawler-handler.interface';
import UrlValidator from '@src/utils/url-validator';
import { CRAWLER_SNOWLEADER_HOSTNAME } from '@src/crawler/handlers/crawler-source-hostname';
import { CrawlerItem } from '@crawler/crawler-item.interface';
import { Logger } from 'nestjs-pino';
import {
  SNOWLEADER_PRICE_REGEX,
  priceTransformer,
} from '@src/utils/price-transformer';

@Injectable()
export class CrawlerSnowLeaderHandler implements CrawlerHandler {
  constructor(private readonly logger: Logger) {}

  support(href: string): boolean {
    const urlValidator = new UrlValidator(href);

    return (
      urlValidator.isValid() &&
      urlValidator.getHostName() === CRAWLER_SNOWLEADER_HOSTNAME
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
            source: CRAWLER_SNOWLEADER_HOSTNAME,
            category: 'ski_boots',
          } as CrawlerItem;

          item.brand = await page
            .locator('meta[property="product:brand"]')
            .textContent();

          item.productName = await page
            .locator('meta[name="keywords"]')
            .getAttribute('content');

          item.salePrice = parseFloat(
            await page
              .locator('meta[property="product:price:amount"]')
              .getAttribute('content'),
          );

          const originPriceStr = await page
            .locator('.c-product-infos .c-product-price__regular')
            .first()
            .innerText();

          if (originPriceStr) {
            item.originPrice = parseFloat(
              priceTransformer(originPriceStr, SNOWLEADER_PRICE_REGEX)
            );
          }

          item.currency = await page
            .locator('meta[property="product:price:currency"]')
            .getAttribute('content');

          this.logger.log(item);

          // Save results as JSON to ./storage/datasets/default
          // await Dataset.pushData(item);
        } else {
          // Extract links from the current page
          // and add them to the crawling queue.
          await enqueueLinks({
            selector: '.c-product-item__link > a',
            label: 'DETAIL',
          });

          await enqueueLinks({
            selector: 'a.c-pagination-bottom__more',
            label: 'LIST',
          });
        }
        await sleep(1000);
      },
    });
  }
}
