import { AppService } from "@/app.service";
import { Users } from "@/users/entities/users.entity";
import { UsersModule } from "@/users/users.module";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { ProductModule } from "./product/product.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.development", ".env.production"]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (confService: ConfigService) => ({
        type: "mongodb",
        url: confService.get<string>("MONGODB_URI"),
        autoLoadEntities: true,
        synchronize: true,
        useUnifiedTopology: true,
        entities: [Users]
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (confService: ConfigService) => ({
        uri: confService.get<string>("MONGODB_URI")
      }),
      inject: [ConfigService]
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res })
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public")
    }),
    /* ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (confService: ConfigService) => ({
        node: confService.get<string>("ELASTICSEARCH_NODE"),
        cloud: {
          id: confService.get<string>("CLOUD_ID")
        }
      }),
      inject: [ConfigService]
    }), */
    UsersModule,
    ProductModule
  ],
  providers: [AppService]
})
export class AppModule {}
