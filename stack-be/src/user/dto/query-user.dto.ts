import { IsEmail, IsNotEmpty } from "class-validator";

export class QueryUserDto {
  username: string;
  role: string;
}
