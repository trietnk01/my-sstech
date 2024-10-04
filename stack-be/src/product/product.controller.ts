import { Controller, Get, Param, Query } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductQueryDto } from "./dto/product-query.dto";

@Controller("product")
export class ProductController {
  constructor(private readonly prodService: ProductService) {}
  @Get()
  getProduct(@Query() query: ProductQueryDto) {
    return this.prodService.getProducts(query.q);
  }

  @Get("/detail/:id")
  getProductDetail(@Param("id") id: number) {
    return this.prodService.getProductDetail(id);
  }
}
