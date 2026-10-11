import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RedirectController } from './redirect.controller';
import { Url, UrlSchema } from './schemas/url.schema';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
  controllers: [UrlsController, RedirectController],
  providers: [UrlsService],
})
export class UrlsModule {}
