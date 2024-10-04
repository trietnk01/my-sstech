import { IUser } from "@/types/user";
import { UserService } from "@/user/user.service";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private confService: ConfigService,
    private jwt: JwtService
  ) {}

  validateUser = async (email: string, password: string) => {
    const user = await this.userService.findByEmail(email);
    if (user) {
      const isValid = this.userService.isValidPassword(password, user.password);
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
      const token: string = await this.jwt.sign(payload, {
        secret: this.confService.get<string>("JWT_ACCESS_TOKEN_SECRET")
      });
      await this.userService.updateUserToken(id, token);
      return {
        id,
        username,
        email,
        fullname,
        token
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
  checkValidToken = async (token: string, user: IUser) => {
    try {
      const userDecode: any = this.jwt.decode(token, { complete: true });
      const payload: IUser = userDecode.payload;
      const signature: string = userDecode.signature;
      let item: IUser = null;
      console.log("token = ", token);
      console.log("user = ", user);
      if (
        payload.id === user.id &&
        payload.username === user.username &&
        payload.email === user.email
      ) {
        const data: IUser | null | undefined = await this.userService.findUserByIdUsernameEmail(
          user.id,
          user.username,
          user.email
        );
        if (data) {
          const tokenV2: string = data.token;
          const decodeV2: any = this.jwt.decode(tokenV2, { complete: true });
          const signatureV2: string = decodeV2.signature;
          if (signature === signatureV2) {
            item = user;
          } else {
            throw new UnauthorizedException();
          }
        }
      }
      return item;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  };
}
