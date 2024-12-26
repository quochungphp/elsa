/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
const config = dotenv.config();
dotenvExpand.expand(config);
enum ENVIRONMENT {
  dev = "dev",
  local = "local",
  staging = "staging",
  prod = "production",
  preprod = "preprod",
  test = "test",
}
export enum WEB_SOCKET_MODE {
  REDIS = "redis",
  WS = "websocket",
}

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    const dir = path.resolve(__dirname, "..", "..", "..", "..");
    let fileName = path.join(dir, "configs/config.json");

    // This config use for local testing
    if (process.env.IS_INTEGRATION_TEST) {
      fileName = path.join(dir, "configs/config.test.json");
    }
    const jsonEnv = fs.readFileSync(fileName);
    this.envConfig = JSON.parse(jsonEnv as any);
  }

  private int(value: string | undefined, number: number): number {
    return value
      ? Number.isNaN(Number.parseInt(value))
        ? number
        : Number.parseInt(value)
      : number;
  }

  private bool(value: string | undefined, boolean: boolean): boolean {
    return value === null || value === undefined ? boolean : value === "true";
  }

  private cors(value: string | undefined): string[] | "all" {
    if (value === "all" || value === undefined) {
      return "all";
    }

    return value
      ? value.split(",").map((name) => name.trim())
      : ["http://localhost:3000"];
  }
  private whitelistedApis(value: string): string[] {
    return value ? value.split(",").map((key) => key.trim()) : [];
  }

  get env(): string {
    return this.envConfig["environment"] || ENVIRONMENT.dev;
  }

  get backendBaseUrl(): string {
    return (
      this.envConfig["backendBaseUrl"] ||
      "http://localhost:" + this.port + "/" + this.apiVersion
    );
  }

  get apiKey(): string {
    return this.whitelistedApiKeys.length ? this.whitelistedApiKeys[0] : "";
  }
  get whitelistedApiKeys(): string[] {
    return this.whitelistedApis(this.envConfig["whitelistedApiKeys"]);
  }

  get adminKey(): string {
    return this.envConfig["adminKey"] || "";
  }

  get host(): string {
    return this.envConfig["host"] || "127.0.0.1";
  }

  get port(): number {
    return this.int(this.envConfig["port"], 9000);
  }

  get wsPort(): number {
    // Use for visualize multi websocket instance
    if (process.env.WS_SECOND_PORT) {
      return this.int(process.env.WS_SECOND_PORT, 9002);
    }
    return this.int(this.envConfig["wsPort"], 9001);
  }

  get timeoutResponse(): number {
    return this.int(this.envConfig["timeoutResponse"], 90000);
  }

  get corsAllowedOrigins(): string[] | string {
    return this.cors(this.envConfig["corsAllowedOrigins"] || "all");
  }

  get corsEnabled(): boolean {
    return this.bool(this.envConfig["corsEnabled"], true);
  }

  get corsAllowedOriginSocketConnection(): string[] | string {
    return this.cors(
      this.envConfig["corsAllowedOriginSocketConnection"] || "*"
    );
  }

  get apiVersion(): string {
    return this.envConfig["apiVersion"] || "v1";
  }

  get apiSemanticVersion(): string {
    return this.envConfig["apiSemanticVersion"] || "v0.0.1";
  }

  get region(): string {
    return this.envConfig["region"] || "us-east-1";
  }

  get isIntegrationTest(): boolean {
    return this.bool(this.envConfig["isIntegrationTest"], false);
  }
  get isEnableExternalError(): boolean {
    return this.bool(this.envConfig["isEnableExternalError"], false);
  }

  get pgPort(): number {
    return this.int(this.envConfig["pgPort"], 5432);
  }
  get pgPassword(): string {
    return this.envConfig["pgPassword"] || "postgres";
  }
  get pgUsername(): string {
    return this.envConfig["pgUsername"] || "postgres";
  }
  get pgHost(): string {
    // Note: when you work on local development, shoube be export IS_LOCAL_MACHINE=true before run
    if (process.env.IS_LOCAL_MACHINE === "true") {
      // start on separate process
      return "localhost";
    }

    return this.envConfig["pgHost"] || "postgres";
  }
  get pgDatabase(): string {
    return this.envConfig["pgDatabase"] || "postgres";
  }

  get pgEnableTypeOrmLog(): boolean {
    return this.bool(this.envConfig["pgEnableTypeOrmLog"], true);
  }
  get redisHost(): string {
    if (process.env.IS_LOCAL_MACHINE === "true") {
      // start on separate process
      return "localhost";
    }
    return this.envConfig["redisHost"] || "redis";
  }
  get redisReplicaHost(): string {
    if (process.env.IS_LOCAL_MACHINE === "true") {
      // start on separate process
      return "localhost";
    }
    return this.envConfig["redisReplicaHost"] || "redis";
  }
  get redisPort(): number {
    return this.int(this.envConfig["redisPort"], 6379);
  }

  get redisPassword(): string {
    return this.envConfig["redisPassword"] || "localhost";
  }

  get instanceServices(): string[] {
    return (this.envConfig["instances"] || "socket,api").split(",");
  }

  get isEnableRedisTLS(): boolean {
    return this.env !== ENVIRONMENT.test && this.env !== ENVIRONMENT.local;
  }

  get webSocketMode(): string {
    return this.envConfig["webSocketMode"] || WEB_SOCKET_MODE.REDIS;
  }

  get aliasEnvironment(): string {
    // Make it consistent reference our SSM parameter rules
    if (this.env === ENVIRONMENT.prod) {
      return "prod";
    }

    return this.env;
  }

  get headerTimestampExpireDurationInSeconds(): number {
    if (this.env === ENVIRONMENT.prod) {
      return 10;
    }

    return 60;
  }

  get performanceTestingKey(): string {
    return this.envConfig["performanceTestingKey"];
  }

  get readyUpCountDownInSeconds(): number {
    return this.int(this.envConfig["readyUpCountDownInSeconds"], 30);
  }
  get readyUpLockCancelInSeconds(): number {
    return this.int(this.envConfig["readyUpLockCancelInSeconds"], 5);
  }
  get awaitingCountDownCancelInSeconds(): number {
    return this.int(this.envConfig["awaitingCountDownCancelInSeconds"], 15);
  }
  get mongoUri(): string {
    return process.env.MONGO_URI || "mongodb://127.0.0.1:27017/elsa";
  }
  get signatureSecretKey(): string {
    return (
      this.envConfig["signatureSecretKey"] ||
      "0674f326-0cac-4e7d-a8d4-4647ae4af346"
    );
  }
  get partnerRefId(): string {
    return "QUIZ";
  }

  get groupRequestIdPrefix(): string {
    return this.partnerRefId.toLowerCase();
  }

  get isEnableTestingCancelWager(): boolean {
    if (this.env === ENVIRONMENT.prod || this.env === ENVIRONMENT.preprod) {
      return false;
    }

    return true;
  }
}
