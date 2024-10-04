import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };
  create = (createUserDto: CreateUserDto) => {
    const hasPassword = this.getHashPassword(createUserDto.password);
    return this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: hasPassword,
        email: createUserDto.email,
        fullname: createUserDto.fullname
      }
    });
  };
  findByUsername = (username: string) => {
    return this.prisma.user.findUnique({ where: { username } });
  };
  isValidPassword = (password: string, hash: string) => {
    return compareSync(password, hash);
  };
  updateUserToken = (id: number, token: string) => {
    return this.prisma.user.update({ where: { id }, data: { token } });
  };
  findUserByToken = (token: string) => {
    return this.prisma.user.findFirstOrThrow({ where: { token } });
  };
}
