import { Injectable } from '@nestjs/common';
import { PlaywrightCrawler } from 'crawlee';
import { CrawlerHandler } from '@crawler/crawler-handler.interface';
import UrlValidator from '@src/utils/url-validator';
import { CRAWLER_ESAY_GLISS_HOSTNAME } from '@crawler/handlers/crawler-hostname';

@Injectable()
export class CrawlerEasyGlissHandler implements CrawlerHandler {
  support(href: string): boolean {
    const urlValidator = new UrlValidator(href);

    return (
      urlValidator.isValid() &&
      urlValidator.getHostName() === CRAWLER_ESAY_GLISS_HOSTNAME
    );
  }

  handle(href: string = null): PlaywrightCrawler {
    if (href) {
      return new PlaywrightCrawler({});
    }
  }
}
