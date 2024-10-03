import { InputType, Int, Field } from "@nestjs/graphql";
import { MinLength } from "class-validator";

@InputType()
export class CreateUserInput {
  @MinLength(1)
  @Field((type) => String)
  username: string;

  @MinLength(1)
  @Field((type) => String)
  password: string;

  @MinLength(1)
  @Field((type) => String)
  email: string;

  @MinLength(1)
  @Field((type) => String)
  display_name: string;
}
