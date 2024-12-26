import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./services/app.service";
import { SharedModule } from "../../shared/shared.module";
import { LoggerMiddleware } from "../../utils/middlewares/logger.middleware";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "../../utils/filters/http-exception.filter";

@Module({
  imports: [SharedModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
