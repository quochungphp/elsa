import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { join } from "node:path";
import "source-map-support/register";
import { ErrorResponseTransformInterceptor } from "./interceptors/error-response-transform.interceptor";
import { SuccessResponseTransformInterceptor } from "./interceptors/success-response-transform.interceptor";
import { TimeoutInterceptor } from "./interceptors/timeout.interceptor";
import { TransformInterceptor } from "./interceptors/transform.interceptor";
import { ConfigService } from "../shared/services/config/config.service";

export async function bootstrapApp(
  app: NestExpressApplication,
  configService: ConfigService
) {
  const { apiVersion, apiSemanticVersion, backendBaseUrl } = configService;
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const config = new DocumentBuilder()
    .addApiKey(
      {
        type: "apiKey",
        name: "x-api-key",
        in: "header",
        description: "API key for external calls",
      },
      "x-api-key"
    )
    .addApiKey(
      {
        type: "apiKey",
        name: "x-api-admin-key",
        in: "header",
        description: "API Admin key for external calls",
      },
      "x-api-admin-key"
    )
    .addApiKey(
      {
        type: "apiKey",
        name: "x-api-user-key",
        in: "header",
        description: "API user key for external calls",
      },
      "x-api-user-key"
    )
    .setTitle("Elsa Quiz Service")
    .setDescription("Handle requests from Quiz UI Container")
    .setVersion(apiSemanticVersion)
    .setExternalDoc(
      "Postman Collection as JSON",
      `${backendBaseUrl}/api-docs-json`
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiVersion}/api-docs`, app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("ejs");

  app.use(helmet());
  const { corsEnabled, corsAllowedOrigins } = configService;
  const cors = corsEnabled
    ? {
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: [
          "Content-Type",
          "Accept",
          "Origin",
          "Referer",
          "User-Agent",
          "Authorization",
          "X-Api-Key",
          "X-Api-Admin-Key",
          "X-Api-User-Key",
          "X-Request-Id",
          "X-Performance-Testing-Key",
          "X-Signature",
          "X-Timestamp",
          "Stark-Key",
        ],
        exposedHeaders: ["X-Correlation-Id", "X-Response-Time", "X-Signature"],
        origin(
          origin: string,
          callback: (error: Error | null, success?: true) => void
        ) {
          if (corsAllowedOrigins === "all") {
            callback(null, true);
            return;
          }
          if (corsAllowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`Origin[${origin}] not allowed by CORS`));
          }
        },
      }
    : {};
  app.enableCors(cors);
  app.useGlobalInterceptors(
    new SuccessResponseTransformInterceptor(),
    new ErrorResponseTransformInterceptor(),
    new TransformInterceptor(),
    new TimeoutInterceptor(configService)
  );
}
