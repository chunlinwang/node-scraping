import { Injectable } from '@nestjs/common';
import { PlaywrightCrawler } from 'crawlee';
import { CRAWLER_XSPO_HOSTNAME } from '@crawler/handlers/crawler-hostname';
import UrlValidator from '@src/utils/url-validator';
import { CrawlerHandler } from '@crawler/crawler-handler.interface';

@Injectable()
export class CrawlerXspoHandler implements CrawlerHandler {
  support(href: string): boolean {
    const urlValidator: UrlValidator = new UrlValidator(href);

    return (
      urlValidator.isValid() &&
      urlValidator.getHostName() === CRAWLER_XSPO_HOSTNAME
    );
  }

  handle(href: string = null): PlaywrightCrawler {
    if (href) {
      return new PlaywrightCrawler({});
    }
  }
}
