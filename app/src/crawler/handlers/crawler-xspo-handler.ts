import { Injectable } from '@nestjs/common';
import { PlaywrightCrawler, sleep } from 'crawlee';
import { CRAWLER_XSPO_HOSTNAME } from '@src/crawler/handlers/crawler-source-hostname';
import UrlValidator from '@src/utils/url-validator';
import { CrawlerHandler } from '@crawler/crawler-handler.interface';
import { CrawlerItem } from '@crawler/crawler-item.interface';
import { Logger } from 'nestjs-pino';
import {
  priceTransformer,
  XSPO_PRICE_REGEX,
} from '@src/utils/price-transformer';

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
            source: CRAWLER_XSPO_HOSTNAME,
            category: 'ski_boots',
          } as CrawlerItem;

          item.currency = await page
            .locator('.product--buybox meta[itemprop="priceCurrency"]')
            .getAttribute('content');

          item.productName = await page
            .locator('.product--buybox h1.product--title[itemprop="name"]')
            .innerText();

          item.brand = await page
            .locator('.product--buybox meta[itemprop="brand"]')
            .getAttribute('content');

          const originPriceStr = await page
            .locator('span.price--line-through')
            .innerText();

          if (originPriceStr) {
            item.originPrice = parseFloat(
              priceTransformer(originPriceStr, XSPO_PRICE_REGEX),
            );
          }

          item.salePrice = parseFloat(
            await page
              .locator(
                '.product--buybox .price--content meta[itemprop="price"]',
              )
              .getAttribute('content'),
          );

          this.logger.log(item); // push to elk.

          // Save results as JSON to ./storage/datasets/default
          // await Dataset.pushData(item);
        } else {
          // Extract links from the current page
          // and add them to the crawling queue.
          await enqueueLinks({
            selector: 'a.product--title',
            label: 'DETAIL',
          });
        }

        await sleep(1000);
      },
    });
  }
}
