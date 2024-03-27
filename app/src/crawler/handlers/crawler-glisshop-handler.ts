import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { PlaywrightCrawler } from 'crawlee';
import { CrawlerHandler } from '@crawler/crawler-handler.interface';
import UrlValidator from '@src/utils/url-validator';
import { CRAWLER_GLISSHOP_HOSTNAME } from '@src/crawler/handlers/crawler-source-hostname';
import { CrawlerItem } from '@crawler/crawler-item.interface';

@Injectable()
export class CrawlerGlisshopHandler implements CrawlerHandler {
  constructor(private readonly logger: Logger) {}

  support(href: string): boolean {
    const urlValidator = new UrlValidator(href);

    return (
      urlValidator.isValid() &&
      urlValidator.getHostName() === CRAWLER_GLISSHOP_HOSTNAME
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
            currency: 'EUR',
            scanDate: new Date(),
            source: CRAWLER_GLISSHOP_HOSTNAME,
          } as CrawlerItem;

          if (request.loadedUrl?.includes('chaussures-ski-alpin')) {
            item.brand = await page
              .locator('.product-details .title > a')
              .textContent();

            item.productName = await page.locator('h1.title').textContent();

            const originPriceStr = (await page
              .locator('#cartBox .product-price p.advice-price__price')
              .first()
              .count())
              ? (
                  await page
                    .locator('#cartBox .product-price p.advice-price__price')
                    .first()
                    .textContent()
                ).trim()
              : null;

            if (originPriceStr) {
              const originPriceArr = originPriceStr.split(' ');
              item.originPrice = parseFloat(
                originPriceArr[0].replace(',', '.'),
              );
            }

            const salePriceStr = (
              await page
                .locator('#cartBox .product-price div.c-price span.price-value')
                .first()
                .textContent()
            ).trim();

            const salePriceArr = salePriceStr.split(' ');

            item.salePrice = parseFloat(salePriceArr[0].replace(',', '.'));

            this.logger.log(item); // push to elk.
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
