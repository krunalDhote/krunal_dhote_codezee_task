import { Controller, Get, HttpStatus, Param, Redirect } from '@nestjs/common';
import {
  ApiFoundResponse,
  ApiGoneResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UrlsService } from './urls.service';

@ApiTags('Redirection')
@Controller()
export class RedirectController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get(':shortCode')
  @Redirect(undefined, HttpStatus.FOUND)
  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiFoundResponse({ description: 'Redirects to the original URL.' })
  @ApiNotFoundResponse({ description: 'Short URL not found.' })
  @ApiGoneResponse({ description: 'Short URL has expired.' })
  async redirect(@Param('shortCode') shortCode: string): Promise<{ url: string }> {
    return { url: await this.urlsService.getOriginalUrl(shortCode) };
  }
}
