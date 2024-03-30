import { Command, CommandRunner, Option } from 'nest-commander';
import { PinoLogger } from 'nestjs-pino';
import { CrawlerService } from '@crawler/crawler.service';
import { ConfigService } from '@nestjs/config';

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
    private configService: ConfigService,
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
      await this.crawlerService.queryRequests(
        this.configService.get<string[]>('sourceLinks'),
      );
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
