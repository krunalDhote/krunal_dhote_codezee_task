import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';

import { CreateUrlDto } from './dto/create-url.dto';
import { CreateUrlResponseDto } from './dto/create-url-response.dto';
import { UrlStatsResponseDto } from './dto/url-stats-response.dto';
import { UrlsService } from './urls.service';

@ApiTags('URLs')
@Controller('api/urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Create a short URL' })
  @ApiCreatedResponse({ type: CreateUrlResponseDto })
  @ApiBadRequestResponse({ description: 'The URL or expiration date is invalid.' })
  @ApiTooManyRequestsResponse({ description: 'URL creation rate limit exceeded.' })
  async create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.create(createUrlDto);
  }

  @Get(':shortCode/stats')
  @ApiOperation({ summary: 'Get short URL analytics' })
  @ApiOkResponse({ type: UrlStatsResponseDto })
  @ApiNotFoundResponse({ description: 'Short URL not found.' })
  async getStats(@Param('shortCode') shortCode: string) {
    return this.urlsService.getStats(shortCode);
  }
}
