import { IUser } from "@/types/user";
import { UserService } from "@/user/user.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private confService: ConfigService,
    private jwt: JwtService
  ) {}

  validateUser = async (username: string, pass: string) => {
    const user = await this.userService.findByUsername(username);
    if (user) {
      const isValid = this.userService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  };
  login = async (user: IUser) => {
    try {
      const { id, username, email, fullname } = user;
      const payload: any = {
        sub: "token login",
        iss: "from server",
        id,
        username,
        email,
        fullname
      };
      const token: string = await this.jwt.signAsync(payload, {
        secret: this.confService.get<string>("JWT_ACCESS_TOKEN_SECRET")
      });
      await this.userService.updateUserToken(id, token);
      return {
        token,
        user: {
          id,
          username,
          email,
          fullname
        }
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  };
  logout = async (user: IUser) => {
    try {
      const { id } = user;
      await this.userService.updateUserToken(id, null);
      return {
        action: "logout"
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  };
}
