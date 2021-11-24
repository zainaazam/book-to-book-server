import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Upload } from '../../upload/entities/upload.entity';

@ObjectType()
export class Account {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  // @Field(() => String)
  // username: string;

  @Field(() => String)
  password: string;

  @Field(() => Upload, { nullable: true })
  photo?: Upload;

  @Field(() => Boolean, { nullable: true })
  deleted?: boolean;

  @Field(() => Date, { nullable: true })
  updated_at?: Date;

  @Field(() => Date)
  created_at: Date;
}
