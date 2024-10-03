import { Field, ObjectType } from "@nestjs/graphql";
import { IUser } from "@/users/users.type";
@ObjectType()
class IProduct {
  @Field((type) => String, { nullable: true })
  _id: string;

  @Field((type) => String, { nullable: true })
  title: string;

  @Field((type) => Number, { nullable: true })
  price: number;

  @Field((type) => String, { nullable: true })
  description: string;

  @Field((type) => String, { nullable: true })
  category: string;

  @Field((type) => String, { nullable: true })
  brand: string;

  @Field((type) => String, { nullable: true })
  sku: string;
}
@ObjectType()
export class ProductType {
  @Field((type) => Boolean)
  status: boolean;

  @Field((type) => String)
  message: string;

  @Field((type) => [IProduct], { nullable: true })
  list: [IProduct];

  @Field((type) => IProduct, { nullable: true })
  item: IProduct;

  @Field((type) => Number, { nullable: true })
  total: Number;
}
