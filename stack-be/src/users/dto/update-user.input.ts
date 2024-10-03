import { CreateUserInput } from "./create-user.input";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";
import { ObjectId } from "typeorm";

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String)
  _id: string;
}
