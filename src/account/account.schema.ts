import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Upload } from '../upload/entities/upload.entity';

export type AccountDocument = Account & Document;

@Schema()
export class Account {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Upload.name,
    autopopulate: true,
  })
  photo: Upload;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: moment })
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
