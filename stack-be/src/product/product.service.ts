import { UsersService } from "@/users/users.service";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Request, Response } from "express";
import * as fs from "fs";
import { FileUpload } from "graphql-upload-ts";
import { Model } from "mongoose";
import { join } from "path";
import { v4 as uuid } from "uuid";
import { CreateProductInput } from "./dto/create-product.input";
import { UpdateProductInput } from "./dto/update-product.input";
import { ProductMongoose } from "./schemas/product-mongoose.schema";
import axios from "axios";
@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductMongoose.name) private productModel: Model<ProductMongoose>,
    private readonly usersService: UsersService
  ) {}
  create = async (CreateProductInput: CreateProductInput, req: Request) => {
    let status: boolean = true;
    let message: string = "";
    let item = null;
    try {
      const isValid: boolean = await this.usersService.checkAuthorized(req);
      if (!isValid) {
        status = false;
        message = "NOT_AUTHENTICATED";
      } else {
        let productItem = await this.productModel.collection.insertOne({
          _id: uuid(),
          product_name: CreateProductInput.product_name
        });
        item = await this.productModel.findById(productItem.insertedId);
      }
    } catch (err) {
      status = false;
      message = err.message;
    }
    return {
      status,
      message,
      item
    };
  };

  findProductAuthenticated = async (
    keyword: string,
    current: string,
    page_size: string,
    req: Request
  ) => {
    let status: boolean = true;
    let message: string = "";
    let list = null;
    let total: number = 0;
    try {
      const isValid: boolean = await this.usersService.checkAuthorized(req);
      if (!isValid) {
        status = false;
        message = "NOT_AUTHENTICATED";
      } else {
        const res: any = await axios.get(`https://dummyjson.com/products/search?q=${keyword}`);
        if (res && res.data && res.data.products) {
          list = res.data.products;
        }
      }
    } catch (err) {
      status = false;
      message = err.message;
    }
    return {
      status,
      message,
      list,
      total
    };
  };
}
