import { IsNotEmpty } from "class-validator";

export class ProductInputDto {
  id: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  description: string;
}
