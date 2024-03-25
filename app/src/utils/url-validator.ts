import { Logger } from '@nestjs/common';

export default class UrlValidator {
  private readonly logger: Logger = new Logger(UrlValidator.name);
  private readonly valid: boolean = false;
  private url?: URL;

  constructor(private readonly href: string) {
    try {
      this.url = new URL(href);
      this.valid = true;
    } catch (e) {
      this.logger.error(e.message);
      this.url = null;
    }
  }

  isValid(): boolean {
    return this.valid;
  }

  getHostName(): string {
    return this.url?.hostname;
  }

  getProtocol(): string {
    return this.url?.protocol;
  }
}
