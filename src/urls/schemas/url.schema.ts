import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Url {
  @Prop({ required: true, unique: true, index: true, immutable: true })
  shortCode!: string;

  @Prop({ required: true })
  originalUrl!: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
