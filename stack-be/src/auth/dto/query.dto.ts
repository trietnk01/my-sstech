import { IsNotEmpty } from "class-validator";

export class QueryDto {
  @IsNotEmpty()
  token: string;
}
