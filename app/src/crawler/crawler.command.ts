import { Command, CommandRunner, Option } from 'nest-commander';
import { PinoLogger } from 'nestjs-pino';
import { CrawlerService } from './crawler.service';

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
    if (options?.boolean !== undefined && options?.boolean !== null) {
      this.runWithBoolean(passedParam, options.boolean);
    } else if (options?.number) {
      this.runWithNumber(passedParam, options.number);
    } else if (options?.string) {
      this.runWithString(passedParam, options.string);
    } else {
      this.runWithNone(passedParam);
    }

    await this.crawlerService.queryRequests([
      'https://www.glisshop.com/ski/chaussure/homme/?facetFilters%5Bf_27875149%5D%5B27874919%5D=1&facetFilters%5Bf_27875149%5D%5B27874920%5D=1',
    ]);
  }

  @Option({
    flags: '-n, --number [number]',
    description: 'A basic number parser',
  })
  parseNumber(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-s, --string [string]',
    description: 'A string return',
  })
  parseString(val: string): string {
    this.logger.info(val);
    return val;
  }

  @Option({
    flags: '-b, --boolean [boolean]',
    description: 'A boolean parser',
  })
  parseBoolean(val: string): boolean {
    return JSON.parse(val);
  }

  runWithString(param: string[], option: string): void {
    this.logger.info({ param, string: option });
  }

  runWithNumber(param: string[], option: number): void {
    this.logger.info({ param, number: option });
  }

  runWithBoolean(param: string[], option: boolean): void {
    this.logger.info({ param, boolean: option });
  }

  runWithNone(param: string[]): void {
    this.logger.info({ param });
  }
}
