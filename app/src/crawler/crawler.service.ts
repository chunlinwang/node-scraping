import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { PlaywrightCrawler, Dataset } from 'crawlee';

@Injectable()
export class CrawlerService {
  private crawler: PlaywrightCrawler;

  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(CrawlerService.name);

    this.crawler = new PlaywrightCrawler({
      requestHandler: async ({ request, page, enqueueLinks, log }) => {
        if (request.label === 'DETAIL') {
          const title = await page.title();
          log.info(`Title of ${request.loadedUrl} is '${title}'`);

          let productName;
          let originPrice;
          let salePrice;
          let brand;
          if (request.loadedUrl?.includes('chaussures-ski-alpin')) {
            brand = await page
              .locator('.product-details .title > a')
              .textContent();

            productName = await page.locator('h1.title').textContent();

            originPrice = await page
              .locator('.product-price p.advice-price__price')
              .first()
              .textContent();

            salePrice = await page
              .locator('.product-price div.c-price span.price-value')
              .first()
              .textContent();
          }

          // Save results as JSON to ./storage/datasets/default
          await Dataset.pushData({
            title,
            url: request.loadedUrl,
            brand,
            productName,
            originPrice,
            salePrice,
          });
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
        // This function will be called for each URL to crawl.
        // async requestHandler({ request, page, enqueueLinks, log }) {
        //   if (request.label === 'DETAIL') {
        //     const title = await page.title();
        //     log.info(`Title of ${request.loadedUrl} is '${title}'`);

        //     let productName;
        //     let originPrice;
        //     let salePrice;
        //     let brand;
        //     if (request.loadedUrl?.includes('pack-ski-fixations')) {
        //       brand = await page.locator('span.title > a').textContent();

        //       productName = await page.locator('h1.title').textContent();

        //       originPrice = await page
        //         .locator('p.advice-price__price')
        //         .first()
        //         .textContent();

        //       salePrice = await page
        //         .locator('p.advice-price__price')
        //         .first()
        //         .getAttribute('data-price-data');
        //     }

        //     // Save results as JSON to ./storage/datasets/default
        //     await Dataset.pushData({
        //       title,
        //       url: request.loadedUrl,
        //       brand,
        //       productName,
        //       originPrice,
        //       salePrice,
        //     });
        //   } else {
        //     // Extract links from the current page
        //     // and add them to the crawling queue.
        //     await enqueueLinks({
        //       selector: '.product-hover > a',
        //       label: 'DETAIL',
        //     });

        //     await enqueueLinks({
        //       selector: '.bottom-pagination > a',
        //       label: 'LIST',
        //     });
        //   }
        // },
        // async requestHandler({ request, sendRequest, ...s }) {
        //   // 'request' contains an instance of the Request class
        //   // Here we simply fetch the HTML of the page and store it to a dataset
        //   const { body, ...rest } = await sendRequest({
        //     url: request.url,
        //     method: request.method,
        //     body: request.payload,
        //     headers: request.headers,
        //   });

        //   console.log(Object.keys(request));
        //   console.log(request.headers);

        //   console.log(Object.keys(s));
        //   console.log(Object.keys(rest));

        //   await Dataset.pushData({
        //     url: request.url,
        //     html: body,
        //   });
        // },
      },
    });
  }

  async queryRequests(urls: string[]): Promise<void> {
    await this.crawler.addRequests(urls);

    await this.crawler.run();

    await this.crawler.getDataset();
  }
}
