import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Url {
  @Prop({ required: true, unique: true })
  shortCode!: string;

  @Prop({ required: true })
  originalUrl!: string;

  @Prop({ type: Date })
  expiresAt?: Date;

  @Prop({ required: true, default: 0 })
  clickCount!: number;

  @Prop({ type: Date })
  lastAccessedAt?: Date;

  createdAt!: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
