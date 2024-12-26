/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-shadow */
import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as httpContext from "express-http-context";
import { v4 as uuidv4 } from "uuid";
import onHeaders = require("on-headers");
import { ConfigService } from "../../shared/services/config/config.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    httpContext.middleware(request, response, () => {
      const startTime = process.hrtime();
      const configService = new ConfigService();
      const correlationId = (
        request.headers["request-id"] ||
        request.headers["x-request-id"] ||
        request.headers["x-correlation-id"] ||
        request.headers.correlationId ||
        uuidv4()
      ).toString();
      const { method, baseUrl, body } = request;
      const url = (baseUrl || "") + (request.url || "-");
      const route = `${method} ${request.route ? request.route.path : url}`;
      const logger = new Logger(LoggerMiddleware.name);

      if (url !== "/") {
        logger.debug(
          JSON.stringify({
            headers: request.headers || {},
            body: request.body || {},
            correlationId,
            url,
            method,
            route,
            message: "Request",
          })
        );
      }

      onHeaders(response, function onHeaders() {
        const diff = process.hrtime(startTime);
        const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
        response.setHeader("keep-alive", configService.timeoutResponse);
        response.setHeader("X-Response-Time", responseTime);
        if (url !== "/") {
          logger.debug(
            JSON.stringify({
              responseTime,
              body: body,
              statusCode: response.statusCode,
              correlationId,
              url,
              method,
              message: "Response",
            })
          );
        }
      });

      request.logger = logger;
      request.correlationId = correlationId;
      response.setHeader("x-correlation-id", correlationId);
      next();
    });
  }
}
