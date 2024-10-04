import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class ProductService {
  constructor(private confService: ConfigService) {}
  getProducts = async (q: string) => {
    try {
      let productUrl: string = this.confService.get<string>("API_PRODUCT");
      if (q) {
        productUrl += `/search?q=${q}`;
      }
      const res: any = await axios.get(productUrl);
      let products: any = [];
      if (res && res.data && res.data.products && res.data.products.length > 0) {
        products = res.data.products;
      }
      return products;
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
}
