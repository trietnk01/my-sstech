import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "@/users/users.module";
import { ProductResolver } from "./product.resolver";
import { ProductService } from "./product.service";
import { ProductMongoose, ProductSchema } from "./schemas/product-mongoose.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProductMongoose.name, schema: ProductSchema }]),
    UsersModule
  ],
  providers: [ProductResolver, ProductService]
})
export class ProductModule {}
