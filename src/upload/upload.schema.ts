import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as moment from 'moment';

export type UploadDocument = Upload & Document;

@Schema()
export class Upload {
  @Prop()
  type: string;

  @Prop()
  filename: string;

  @Prop({ default: moment })
  created_at: Date;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
