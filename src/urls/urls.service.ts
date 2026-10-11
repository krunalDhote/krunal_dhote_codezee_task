import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'node:crypto';
import { Model } from 'mongoose';

import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './schemas/url.schema';

export interface CreateUrlResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
}

const SHORT_CODE_LENGTH = 6;
const MAX_CREATE_ATTEMPTS = 5;
const ALPHANUMERIC_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const MAX_UNBIASED_BYTE = 248;

@Injectable()
export class UrlsService {
  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<Url>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUrlDto: CreateUrlDto): Promise<CreateUrlResponse> {
    for (let attempt = 0; attempt < MAX_CREATE_ATTEMPTS; attempt += 1) {
      const shortCode = this.generateShortCode();

      try {
        await this.urlModel.create({ shortCode, originalUrl: createUrlDto.originalUrl });

        return {
          shortCode,
          shortUrl: `${this.getBaseUrl()}/${shortCode}`,
          originalUrl: createUrlDto.originalUrl,
        };
      } catch (error: unknown) {
        if (this.isDuplicateKeyError(error)) {
          continue;
        }

        throw error;
      }
    }

    throw new ConflictException('Could not generate a unique short code. Please try again.');
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    const url = await this.urlModel
      .findOne({ shortCode })
      .select({ originalUrl: 1, _id: 0 })
      .lean()
      .exec();

    if (url === null) {
      throw new NotFoundException('Short URL not found.');
    }

    return url.originalUrl;
  }

  private generateShortCode(): string {
    let shortCode = '';

    while (shortCode.length < SHORT_CODE_LENGTH) {
      const byte = randomBytes(1)[0];

      if (byte < MAX_UNBIASED_BYTE) {
        shortCode += ALPHANUMERIC_CHARACTERS[byte % ALPHANUMERIC_CHARACTERS.length];
      }
    }

    return shortCode;
  }

  private getBaseUrl(): string {
    return this.configService.getOrThrow<string>('BASE_URL').replace(/\/$/, '');
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 11_000;
  }
}
