import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common";

import { CurrentUser, Public, ResponseMessage } from "@/decorator/customize";
import { IUser } from "@/types/user";
import { AuthService } from "./auth.service";
import { QueryDto } from "./dto/query.dto";
import { LocalAuthGuard } from "./local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("Login user successfully")
  @Post("login")
  login(@CurrentUser() user: IUser) {
    return this.auth.login(user);
  }

  @Get("check-valid-token")
  @ResponseMessage("Check valid token")
  checkValidToken(@Query() query: QueryDto, @CurrentUser() user: IUser) {
    return this.auth.checkValidToken(query.token, user);
  }

  @Get("profile")
  getProfile(@CurrentUser() user: IUser) {
    return user;
  }

  @Post("logout")
  logout(@CurrentUser() user: IUser) {
    return this.auth.logout(user);
  }
}
