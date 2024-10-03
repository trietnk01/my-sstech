import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ProductDocument = HydratedDocument<ProductMongoose>;

@Schema({ collection: "product" })
export class ProductMongoose {
  @Prop({ required: true })
  _id: string;

  @Prop()
  product_name: string;
}

export const ProductSchema = SchemaFactory.createForClass(ProductMongoose);
