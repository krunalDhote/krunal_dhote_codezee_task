import { Controller, Get, HttpStatus, Param, Redirect } from '@nestjs/common';

import { UrlsService } from './urls.service';

@Controller()
export class RedirectController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get(':shortCode')
  @Redirect(undefined, HttpStatus.FOUND)
  async redirect(@Param('shortCode') shortCode: string): Promise<{ url: string }> {
    return { url: await this.urlsService.getOriginalUrl(shortCode) };
  }
}
