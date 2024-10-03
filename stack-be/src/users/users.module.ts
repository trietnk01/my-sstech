import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./entities/users.entity";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Users])],
  providers: [UsersResolver, UsersService, JwtService],
  exports: [UsersService]
})
export class UsersModule {}
