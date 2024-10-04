import { Controller, Get, Post, UseGuards } from "@nestjs/common";

import { Public, User } from "@/decorator/customize";
import { IUser } from "@/types/user";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  login(@User() user: IUser) {
    return this.auth.login(user);
  }

  @Get("/profile")
  getProfile(@User() user: IUser) {
    return user;
  }

  @Get("/logout")
  logout(@User() user: IUser) {
    return this.auth.logout(user);
  }

  @Public()
  @Get("/account")
  getAccount() {
    return { account: "account" };
  }
}
