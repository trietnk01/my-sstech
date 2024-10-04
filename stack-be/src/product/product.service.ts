import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { ProductInputDto } from "./dto/product-input.dto";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class ProductService {
  constructor(
    private confService: ConfigService,
    private prisma: PrismaService
  ) {}
  getCategoryProduct = async () => {
    try {
      const res: any = await axios.get(
        `${this.confService.get<string>("API_PRODUCT")}/category-list`
      );
      let list: any = [];
      if (res.data && res.data.length > 0) {
        res.data.forEach((elmt) => {
          let item: any = { id: elmt, category_name: elmt };
          list.push(item);
        });
      }
      return list;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
  getProducts = async (q: string, page: string, limit: string) => {
    try {
      const skip: number = (parseInt(page) - 1) * parseInt(limit);
      let where: any = {};
      if (q) {
        where["q"] = q;
      }
      where["limit"] = limit;
      where["skip"] = skip;
      let txtSearch: string = "";
      for (const [key, val] of Object.entries(where)) {
        txtSearch += `${key}=${val}&`;
      }
      txtSearch = txtSearch.slice(0, txtSearch.length - 1);
      let productUrl: string = "";
      if (!q) {
        productUrl = `${this.confService.get<string>("API_PRODUCT")}?${txtSearch}`;
      } else {
        productUrl = `${this.confService.get<string>("API_PRODUCT")}/search?${txtSearch}`;
      }
      const res: any = await axios.get(productUrl);
      let list: any = [];
      let total: number = 0;
      if (res && res.data && res.data.products && res.data.products.length > 0) {
        total = parseInt(res.data.total);
        list = res.data.products;
      }
      return { list, total };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
  getProductDetail = async (id: number) => {
    try {
      let url: string = this.confService.get<string>("API_PRODUCT");
      if (id) {
        url += `/${id}`;
      }
      const res: any = await axios.get(url);
      let data: any = null;
      if (res && res.data) {
        data = res.data;
      }
      return data;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
  save = async (prodInput: ProductInputDto) => {
    try {
      return this.prisma.product.create({
        data: {
          title: prodInput.title,
          category: prodInput.category,
          description: prodInput.description
        }
      });
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
}
