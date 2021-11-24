import { InputType, Field, ID } from '@nestjs/graphql';
import { Upload } from 'src/upload/entities/upload.entity';

@InputType()
export class CreateAccountInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  // @Field(() => String, { nullable: true })
  // username?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => ID, { nullable: true })
  photo?: Upload;
}
