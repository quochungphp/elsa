import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ConfigService } from "../../shared/services/config/config.service";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private configService: ConfigService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const cause = (exception.getResponse() || exception.cause) as {
      key: string;
      args: Record<string, unknown>;
    };

    try {
      const externalErrors =
        this.configService.isEnableExternalError && cause && cause["apiErrors"]
          ? cause["apiErrors"] ?? undefined
          : undefined;
      let errorCodeFromCore = null || undefined;
      if (externalErrors) {
        errorCodeFromCore = externalErrors.errors[0].errorCode;
      }
      response.status(status).json({
        status: "error",
        errors: [
          {
            code: status,
            title: cause["error"],
            errorCode: cause["code"],
            detail: cause["message"],
            correlationId: request.correlationId || "",
            timestamp: new Date().toISOString(),
            path: request.url,
            externalErrorCode: errorCodeFromCore,
            externalErrors,
          },
        ],
      });
    } catch (error) {
      request.logger.error(error, "Exception request in HttpExceptionFilter");
    }
  }
}
