import { IsEmail, IsNotEmpty } from "class-validator";

export class ProductInputDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  description: string;
}
