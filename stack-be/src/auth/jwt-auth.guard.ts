import { IUser } from "@/types/user";
import { UserService } from "@/user/user.service";
import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "@/decorator/customize";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private userService: UserService,
    private reflector: Reflector
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass()
      ]);
      if (isPublic) {
        return true;
      } else {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
          throw new UnauthorizedException();
        }
        const userRow: IUser = await this.userService.findUserByToken(token);
        if (!userRow) {
          throw new UnauthorizedException();
        }
        return super.canActivate(context);
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
