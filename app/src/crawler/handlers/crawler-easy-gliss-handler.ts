import { Injectable } from '@nestjs/common';
import { PlaywrightCrawler, sleep } from 'crawlee';
import { CrawlerHandler } from '@crawler/crawler-handler.interface';
import UrlValidator from '@src/utils/url-validator';
import { CRAWLER_ESAY_GLISS_HOSTNAME } from '@src/crawler/handlers/crawler-source-hostname';
import { CrawlerItem } from '@crawler/crawler-item.interface';
import { Logger } from 'nestjs-pino';
import {
  EASYGLISS_PRICE_REGEX,
  priceTransformer,
} from '@src/utils/price-transformer';

@Injectable()
export class CrawlerEasyGlissHandler implements CrawlerHandler {
  constructor(private readonly logger: Logger) {}

  support(href: string): boolean {
    const urlValidator = new UrlValidator(href);

    return (
      urlValidator.isValid() &&
      urlValidator.getHostName() === CRAWLER_ESAY_GLISS_HOSTNAME
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
            source: CRAWLER_ESAY_GLISS_HOSTNAME,
            category: 'ski_boots',
          } as CrawlerItem;

          item.brand = await page
            .locator('.bloc_titre_produit h1 > b')
            .textContent();

          item.productName = await page
            .locator('.bloc_titre_produit h1')
            .innerText();

          item.salePrice = parseFloat(
            await page
              .locator('.our_price_display meta[itemprop="price"]')
              .getAttribute('content'),
          );

          const originPriceStr = await page
            .locator('#old_price_display > span.price')
            .innerText();

          if (originPriceStr) {
            item.originPrice = parseFloat(
              priceTransformer(originPriceStr, EASYGLISS_PRICE_REGEX),
            );
          }

          item.currency = await page
            .locator('.our_price_display meta[itemprop="priceCurrency"]')
            .getAttribute('content');

          this.logger.log(item);

          // Save results as JSON to ./storage/datasets/default
          // await Dataset.pushData(item);
        } else {
          // Extract links from the current page
          // and add them to the crawling queue.
          await enqueueLinks({
            selector: 'a.product_img_link',
            label: 'DETAIL',
          });

          await enqueueLinks({
            selector: 'ul.pagination > a',
            label: 'LIST',
          });
        }
        await sleep(1000);
      },
    });
  }
}
