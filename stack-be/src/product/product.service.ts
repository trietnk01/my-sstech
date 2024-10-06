import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { ProductInputDto } from "./dto/product-input.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { ProductQueryDto } from "./dto/product-query.dto";

@Injectable()
export class ProductService {
  constructor(private confService: ConfigService) {}
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
  getProducts = async (query: ProductQueryDto) => {
    try {
      const skip: number = (parseInt(query.page) - 1) * parseInt(query.limit);
      let where: any = {};
      if (query.q) {
        where["q"] = query.q;
      }
      where["limit"] = query.limit;
      where["skip"] = skip;
      let txtSearch: string = "";
      for (const [key, val] of Object.entries(where)) {
        txtSearch += `${key}=${val}&`;
      }
      txtSearch = txtSearch.slice(0, txtSearch.length - 1);
      let productUrl: string = "";
      let res: any = null;
      let list: any = [];
      let total: number = 0;
      if (query.q && query.category_product_id) {
        productUrl = `${this.confService.get<string>("API_PRODUCT")}/category/${query.category_product_id}`;
      } else {
        if (query.q) {
          productUrl = `${this.confService.get<string>("API_PRODUCT")}/search?${txtSearch}`;
        } else {
          if (query.category_product_id) {
            productUrl = `${this.confService.get<string>("API_PRODUCT")}/category/${query.category_product_id}`;
          } else {
            productUrl = `${this.confService.get<string>("API_PRODUCT")}?${txtSearch}`;
          }
        }
      }
      res = await axios.get(productUrl);
      if (res && res.data && res.data.products && res.data.products.length > 0) {
        total = parseInt(res.data.total);
        if (query.q && query.category_product_id) {
          const pattern = new RegExp(query.q);
          let productsDraf: any[] = res.data.products;
          productsDraf.forEach((elmt) => {
            if (pattern.test(elmt.title)) {
              list.push(elmt);
            }
          });
        } else {
          list = res.data.products;
        }
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
      let res: any = null;
      if (!prodInput.id) {
        res = await axios.post(`${this.confService.get<string>("API_PRODUCT")}/add`, prodInput, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        res = await axios.put(
          `${this.confService.get<string>("API_PRODUCT")}/${prodInput.id}`,
          prodInput,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );
      }
      return res.data;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
}
