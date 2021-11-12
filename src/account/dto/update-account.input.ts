import { CreateAccountInput } from './create-account.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAccountInput extends PartialType(CreateAccountInput) {
  @Field(() => String)
  id: string;

  @Field(() => Boolean)
  deleted?: boolean;
}
