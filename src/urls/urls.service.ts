import { ConflictException, GoneException, Injectable, NotFoundException } from '@nestjs/common';
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

export interface UrlStatsResponse {
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  lastAccessedAt?: Date;
  createdAt: Date;
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
        await this.urlModel.create({
          shortCode,
          originalUrl: createUrlDto.originalUrl,
          expiresAt:
            createUrlDto.expiresAt === undefined ? undefined : new Date(createUrlDto.expiresAt),
        });

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
    const accessedAt = new Date();
    const url = await this.urlModel
      .findOneAndUpdate(
        {
          shortCode,
          $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gt: accessedAt } },
          ],
        },
        {
          $inc: { clickCount: 1 },
          $set: { lastAccessedAt: accessedAt },
        },
        { new: true },
      )
      .select({ originalUrl: 1, _id: 0 })
      .lean()
      .exec();

    if (url !== null) {
      return url.originalUrl;
    }

    const existingUrl = await this.urlModel
      .findOne({ shortCode })
      .select({ expiresAt: 1, _id: 0 })
      .lean()
      .exec();

    if (existingUrl === null) {
      throw new NotFoundException('Short URL not found.');
    }

    if (
      existingUrl.expiresAt !== undefined &&
      existingUrl.expiresAt !== null &&
      existingUrl.expiresAt.getTime() <= accessedAt.getTime()
    ) {
      throw new GoneException('Short URL has expired.');
    }

    throw new NotFoundException('Short URL not found.');
  }

  async getStats(shortCode: string): Promise<UrlStatsResponse> {
    const url = await this.urlModel
      .findOne({ shortCode })
      .select({
        shortCode: 1,
        originalUrl: 1,
        clickCount: 1,
        lastAccessedAt: 1,
        createdAt: 1,
        _id: 0,
      })
      .lean()
      .exec();

    if (url === null) {
      throw new NotFoundException('Short URL not found.');
    }

    return {
      ...url,
      clickCount: url.clickCount ?? 0,
    };
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
