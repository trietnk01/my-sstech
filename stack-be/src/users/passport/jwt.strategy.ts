import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IUser } from "@/users/users.interface";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private cfService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfService.get<string>("JWT_ACCESS_TOKEN_SECRET")
    });
  }

  validate(payload: any) {
    const { _id, username, display_name, email } = payload;
    return { _id, username, display_name, email };
  }
}
