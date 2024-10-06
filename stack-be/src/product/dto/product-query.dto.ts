import { IsNotEmpty } from "class-validator";

export class ProductQueryDto {
  q: string;

  category_product_id: string;

  @IsNotEmpty()
  page: string;

  @IsNotEmpty()
  limit: string;
}
