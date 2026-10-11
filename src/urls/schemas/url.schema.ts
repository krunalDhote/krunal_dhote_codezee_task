import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Url {
  @Prop({ required: true, unique: true, index: true })
  shortCode!: string;

  @Prop({ required: true })
  originalUrl!: string;

  @Prop({ type: Date })
  expiresAt?: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
