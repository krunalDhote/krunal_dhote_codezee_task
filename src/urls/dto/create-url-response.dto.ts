import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlResponseDto {
  @ApiProperty({ example: 'aB12xY' })
  shortCode!: string;

  @ApiProperty({ example: 'http://localhost:3000/aB12xY' })
  shortUrl!: string;

  @ApiProperty({ example: 'https://example.com/article' })
  originalUrl!: string;
}
