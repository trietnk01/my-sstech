import { Public, ResponseMessage } from "@/decorator/customize";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryUserDto } from "./dto/query-user.dto";
import { UserService } from "./user.service";
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @ResponseMessage("Create user successfully")
  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ResponseMessage("Get user by username param successfully")
  @Get()
  findByEmail(@Query() query: QueryUserDto) {
    return this.userService.findByEmail(query.username);
  }

  @ResponseMessage("Get user by username and role param successfully")
  @Get(":username/:role")
  findByUsernameParam(@Param("username") username: string, @Param("role") role: string) {
    return { username, role };
  }

  @ResponseMessage("Get user by username and role query successfully")
  @Get()
  findByUsernameQuery(@Query() query: QueryUserDto) {
    const username: string = query.username;
    const role: string = query.role;
    return { username, role };
  }
}
