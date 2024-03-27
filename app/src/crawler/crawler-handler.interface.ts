import { PlaywrightCrawler } from 'crawlee';

export interface CrawlerHandler {
  support(href: string): boolean;

  handle(): PlaywrightCrawler;
}
