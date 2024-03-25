import { Injectable } from '@nestjs/common';
import { Dataset, PlaywrightCrawler } from 'crawlee';
import { CrawlerHandler } from '@crawler/crawler-handler.interface';
import UrlValidator from '@src/utils/url-validator';
import { CRAWLER_GLISSHOP_HOSTNAME } from '@crawler/handlers/crawler-hostname';
import { CrawlerItem } from '@crawler/crawler-item.interface';

@Injectable()
export class CrawlerGlisshopHandler implements CrawlerHandler {
  support(href: string): boolean {
    const urlValidator = new UrlValidator(href);

    return (
      urlValidator.isValid() &&
      urlValidator.getHostName() === CRAWLER_GLISSHOP_HOSTNAME
    );
  }

  handle(href: string = null): PlaywrightCrawler {
    if (href) {
      return new PlaywrightCrawler({
        requestHandler: async ({ request, page, enqueueLinks, log }) => {
          if (request.label === 'DETAIL') {
            const title = await page.title();
            log.info(`Title of ${request.loadedUrl} is '${title}'`);

            const item = {
              title,
              url: request.loadedUrl,
            } as CrawlerItem;

            if (request.loadedUrl?.includes('chaussures-ski-alpin')) {
              item.brand = await page
                .locator('.product-details .title > a')
                .textContent();

              item.productName = await page.locator('h1.title').textContent();

              item.originPrice = (
                await page
                  .locator('.product-price p.advice-price__price')
                  .first()
                  .textContent()
              ).trim();

              item.salePrice = (
                await page
                  .locator('.product-price div.c-price span.price-value')
                  .first()
                  .textContent()
              ).trim();
            }

            // Save results as JSON to ./storage/datasets/default
            await Dataset.pushData(item);
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
}
