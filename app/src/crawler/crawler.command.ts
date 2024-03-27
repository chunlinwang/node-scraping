import { Command, CommandRunner, Option } from 'nest-commander';
import { PinoLogger } from 'nestjs-pino';
import { CrawlerService } from '@crawler/crawler.service';

interface BasicCommandOptions {
  string?: string;
  boolean?: boolean;
  number?: number;
}

@Command({
  name: 'crawler',
  description: 'crawler cmd',
  arguments: '',
  options: {},
})
export class CrawlerCommand extends CommandRunner {
  constructor(
    private readonly crawlerService: CrawlerService,
    private readonly logger: PinoLogger,
  ) {
    super();
    this.logger.setContext(CrawlerCommand.name);
  }

  async run(
    passedParam: string[],
    options?: BasicCommandOptions,
  ): Promise<void> {
    if (options?.string) {
      await this.crawlerService.queryRequests([options.string]);
    } else {
      await this.crawlerService.queryRequests([
        'https://www.glisshop.com/ski/chaussure/homme/?facetFilters%5Bf_27875149%5D%5B27874919%5D=1&facetFilters%5Bf_27875149%5D%5B27874920%5D=1',
      ]);
    }
  }

  @Option({
    flags: '-s, --string [string]',
    description: 'a link url',
  })
  parseString(val: string): string {
    this.logger.info(val);
    return val;
  }
}
