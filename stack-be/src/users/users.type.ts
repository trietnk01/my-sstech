import { Field, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "typeorm";

@ObjectType()
export class IUser {
  @Field((type) => String, { nullable: true })
  _id: string;

  @Field((type) => String, { nullable: true })
  username: string;

  @Field((type) => String, { nullable: true })
  email: string;

  @Field((type) => String, { nullable: true })
  display_name: string;

  @Field((type) => String, { nullable: true })
  token: string;
}
@ObjectType()
export class UsersType {
  @Field((type) => Number)
  status: number;

  @Field((type) => String)
  message: string;

  @Field((type) => [IUser], { nullable: true })
  list: [IUser];

  @Field((type) => IUser, { nullable: true })
  item: IUser;
}
