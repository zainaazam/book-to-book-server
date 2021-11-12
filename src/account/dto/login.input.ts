import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(() => String)
  emailPhoneOrUsername: string;

  @Field(() => String)
  password: string;
}
