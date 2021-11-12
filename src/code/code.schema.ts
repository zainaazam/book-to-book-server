import { Document, Schema as MongooseSchema } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Account } from 'src/account/account.schema';
// import { Child } from 'src/child/child.schema';

export type CodeDocument = Code & Document;

@Schema()
export class Code {
  @Prop()
  code: string;

  @Prop({ default: true })
  valid: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Account.name,
    autopopulate: true,
  })
  account: Account;

  @Prop()
  expiry_date: Date;

  @Prop({ default: moment })
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const CodeSchema = SchemaFactory.createForClass(Code);
