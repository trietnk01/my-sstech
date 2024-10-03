import { Field, InputType } from "@nestjs/graphql";
import { MinLength } from "class-validator";

@InputType()
export class CreateProductInput {
  @MinLength(1)
  @Field((type) => String)
  product_name: string;
}
