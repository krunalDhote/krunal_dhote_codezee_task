import {
  IsISO8601,
  IsOptional,
  IsString,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

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
  @IsString()
  @IsSafeHttpUrl()
  originalUrl!: string;

  @IsOptional()
  @IsISO8601()
  @IsFutureDate()
  expiresAt?: string;
}
