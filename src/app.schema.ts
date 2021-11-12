import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as moment from 'moment';

// import { Account } from 'src/account/account.schema';
export type TokenDocument = Token & Document;
@Schema()
export class Token {
  @Prop()
  token: string;

  @Prop({ default: true })
  valid: boolean;

  @Prop()
  expiry_date: Date;

  @Prop({ default: moment })
  created_at: Date;

  @Prop()
  updated_at: Date;
}
export const TokenSchema = SchemaFactory.createForClass(Token);
