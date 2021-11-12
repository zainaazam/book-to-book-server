import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Upload {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field(() => String, { nullable: true })
  type: string;

  @Field(() => String, { nullable: true })
  filename: string;

  @Field(() => String, { nullable: true })
  thumbnail: string;

  @Field(() => Date, { nullable: true })
  created_at: Date;
}
