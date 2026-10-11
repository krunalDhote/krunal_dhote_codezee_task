import {
  IsISO8601,
  IsOptional,
  IsString,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

function IsSafeHttpUrl(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'isSafeHttpUrl',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') {
            return false;
          }

          try {
            const url = new URL(value);
            return (
              (url.protocol === 'http:' || url.protocol === 'https:') &&
              !url.username &&
              !url.password
            );
          } catch {
            return false;
          }
        },
        defaultMessage(): string {
          return 'originalUrl must be an HTTP or HTTPS URL without embedded credentials.';
        },
      },
    });
  };
}

function IsFutureDate(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return typeof value === 'string' && Date.parse(value) > Date.now();
        },
        defaultMessage(): string {
          return 'expiresAt must be a future date.';
        },
      },
    });
  };
}

export class CreateUrlDto {
  @ApiProperty({ example: 'https://example.com/article' })
  @IsString()
  @IsSafeHttpUrl()
  originalUrl!: string;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.000Z', format: 'date-time' })
  @IsOptional()
  @IsISO8601()
  @IsFutureDate()
  expiresAt?: string;
}
