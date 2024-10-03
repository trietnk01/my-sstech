import { AppModule } from "@/app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { graphqlUploadExpress } from "graphql-upload-ts";
import { join } from "path";
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  const confService = app.get(ConfigService);
  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors();
  const port: string = confService.get<string>("PORT");
  await app.listen(port);
}
bootstrap();
