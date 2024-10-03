import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Request, Response } from "express";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";
import { CreateProductInput } from "./dto/create-product.input";
import { UpdateProductInput } from "./dto/update-product.input";
import { ProductService } from "./product.service";
import { ProductType } from "./product.type";
import { Req, Res } from "@nestjs/common";

@Resolver(() => ProductType)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => ProductType)
  createProduct(
    @Args("CreateProductInput") CreateProductInput: CreateProductInput,
    @Context("req") req: Request
  ) {
    return this.productService.create(CreateProductInput, req);
  }

  @Query(() => ProductType)
  findProductAuthenticated(
    @Args("keyword", { type: () => String }) keyword: string,
    @Args("current", { type: () => String }) current: string,
    @Args("page_size", { type: () => String }) page_size: string,
    @Context("req") req: Request
  ) {
    return this.productService.findProductAuthenticated(keyword, current, page_size, req);
  }
}
