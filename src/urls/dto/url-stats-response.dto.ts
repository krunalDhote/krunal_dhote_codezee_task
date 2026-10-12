import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UrlStatsResponseDto {
  @ApiProperty({ example: 'aB12xY' })
  shortCode!: string;

  @ApiProperty({ example: 'https://example.com/article' })
  originalUrl!: string;

  @ApiProperty({ example: 25 })
  clickCount!: number;

  @ApiPropertyOptional({ example: '2026-10-11T12:00:00.000Z', format: 'date-time' })
  lastAccessedAt?: Date;

  @ApiProperty({ example: '2026-10-11T10:00:00.000Z', format: 'date-time' })
  createdAt!: Date;
}
