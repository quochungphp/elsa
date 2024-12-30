/* eslint-disable no-console */

import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { useContainer } from "class-validator";
import { INestApplication, Logger } from "@nestjs/common";
import { AppModule } from "./modules/app/app.module";
import { bootstrapApp } from "./utils/bootstrap-app";
import { bootstrapRouteLog } from "./utils/bootstrap-route-log";
import { WebSocketRedisIOAdapter } from "./modules/ws/ws-redis-io.adapter";
import { WsStateService } from "./modules/ws/ws-state.service";
import { ConfigService } from "./shared/services/config/config.service";
import { WsRedisDispatcherService } from "./modules/ws/ws-redis-dispatcher.service";
import { WsModule } from "./modules/ws/ws.module";

export class App {
  private configService: ConfigService;
  logger = new Logger(App.name);
  constructor(configService: ConfigService) {
    this.configService = configService;
  }
  async startWebSocket() {
    try {
      const app = await NestFactory.create(WsModule);
      // Init ws manage states
      const wsStateService = app.get(WsStateService);
      this.logger.log(`App uses WsStateService`);
      // Init ws dispatcher
      const wsRedisDispatcherService = app.get(WsRedisDispatcherService);
      this.logger.log(`App uses WsRedisDispatcherService`);

      // Init RedisIO
      const redisIoAdapter = new WebSocketRedisIOAdapter(
        app,
        wsStateService,
        wsRedisDispatcherService
      );
      this.logger.log(`App uses WebSocketRedisIOAdapter`);

      await redisIoAdapter.connectToRedis(this.configService);

      this.logger.log(`App connects redis success`);

      // Register Websocket
      app.useWebSocketAdapter(redisIoAdapter);

      // Hook the life cycle start app to log tracking information
      const { host, wsPort } = this.configService;
      const logMessage = `Websocket server started host: ${host}:${wsPort}`;
      await app
        .listen(wsPort, () => {
          console.log(logMessage)
          this.logger.log(logMessage);
        })
        .catch((error) => {
          console.log(">>>>>>>11>", error)
          this.logger.error(
            {
              error: error,
              errorStack: error.stack,
            },
            "fail to start server"
          );
          process.exit(1);
        });
    } catch (error) {
      throw error;
    }
  }

  async startHTTP() {
    const app = await NestFactory.create(AppModule);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    const { port, host } = this.configService;

    bootstrapApp(<NestExpressApplication>app, this.configService);
    bootstrapRouteLog(<INestApplication>app);

    // Hook the life cycle start app to log tracking information
    const logMessage = `Api server started host: ${host}:${port} `;
    await app
      .listen(port, () => {
        this.logger.log(logMessage);
      })
      .catch((error) => {
        this.logger.error(
          {
            err: error,
            errorStack: error.stack,
          },
          "fail to start server"
        );
        process.exit(1);
      });
  }
}

const run = () => {
  const envConfig = new ConfigService();
  const app = new App(envConfig);
  app.startHTTP().catch(console.error);
  app.startWebSocket().catch(console.error);
};

run();
