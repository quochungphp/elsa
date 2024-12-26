import {
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";
import axios, { RawAxiosRequestHeaders } from "axios";
import { RequestContext } from "../../../utils/request-context";
import { ConfigService } from "../config/config.service";
import { AppRequest } from "../../../utils/app-request";

export interface QueryParams {
  [key: string]: string | number | undefined;
}

export default abstract class BaseApiService {
  protected baseURL = "";

  protected context: RequestContext;

  protected configService: ConfigService;

  constructor(baseURL: string, configService: ConfigService) {
    this.baseURL = baseURL;
    this.configService = configService;
  }

  protected handleError(error: any) {
    if (error.response) {
      const { status, statusText } = error?.response;
      if (error.response.status === HttpStatus.NOT_FOUND) {
        this.context.logger.fatal(
          {
            ...error.response.data,
            correlationId: this.context.correlationId,
          },
          "Request to api"
        );
        throw new NotFoundException({
          status,
          statusText,
          apiErrors: error.response.data,
        });
      }
      if (error.response.status === HttpStatus.BAD_REQUEST) {
        this.context.logger.fatal(
          {
            ...error.response.data,
            correlationId: this.context.correlationId,
          },
          "Request to api"
        );
        throw new BadRequestException({
          status,
          statusText,
          apiErrors: error.response.data,
        });
      }
      if (error.response.status === HttpStatus.UNAUTHORIZED) {
        this.context.logger.fatal(
          {
            ...error.response.data,
            correlationId: this.context.correlationId,
          },
          "Request to api"
        );
        throw new UnauthorizedException({
          status,
          statusText,
          apiErrors: error.response.data,
        });
      }
      throw new InternalServerErrorException({
        status,
        statusText,
        apiErrors: error.response.data,
      });
    }
    if (error.code === "ECONNREFUSED") {
      throw new InternalServerErrorException({
        message: "Connection refused",
      });
    }

    this.context.logger.fatal(
      {
        error,
        correlationId: this.context.correlationId,
      },
      "Request to api"
    );
    throw new InternalServerErrorException(error);
  }

  protected async get(
    context: RequestContext,
    url: string,
    query?: QueryParams,
    headers?: RawAxiosRequestHeaders
  ) {
    try {
      this.context = context;
      return axios.get(url, {
        params: query,
        headers: this.buildHeaders(context, headers),
        baseURL: this.baseURL,
        timeout: this.configService.timeoutResponse,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  protected async post(
    context: RequestContext,
    url: string,
    data: any,
    headers?: RawAxiosRequestHeaders
  ) {
    try {
      this.context = context;
      return axios.post(url, data, {
        headers: this.buildHeaders(context, headers),
        baseURL: this.baseURL,
        timeout: this.configService.timeoutResponse,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  protected async put(
    context: RequestContext,
    url: string,
    data: any,
    headers?: RawAxiosRequestHeaders
  ) {
    try {
      this.context = context;
      return axios.put(url, data, {
        headers: this.buildHeaders(context, headers),
        baseURL: this.baseURL,
        timeout: this.configService.timeoutResponse,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  protected async delete(
    context: RequestContext,
    url: string,
    data?: any,
    headers?: RawAxiosRequestHeaders
  ) {
    try {
      this.context = context;
      return axios.delete(url, {
        headers: this.buildHeaders(context, headers),
        timeout: this.configService.timeoutResponse,
        baseURL: this.baseURL,
        data,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  private buildHeaders(
    context: RequestContext,
    headers?: RawAxiosRequestHeaders
  ): RawAxiosRequestHeaders {
    if (!headers) {
      return <RawAxiosRequestHeaders>{};
    }

    headers["x-correlation-id"] = context.correlationId;
    const { isPerformanceTesting } = context;

    if (isPerformanceTesting) {
      headers["x-performance-testing-key"] =
        this.configService.performanceTestingKey;
    }

    const { headers: headerParams } = <AppRequest>context;

    if (headerParams) {
      if (headerParams["x-signature"]) {
        headers["x-signature"] = String(headerParams["x-signature"]);
      }

      if (headerParams["x-timestamp"]) {
        headers["x-timestamp"] = String(headerParams["x-timestamp"]);
      }

      if (headerParams["stark-key"]) {
        headers["stark-key"] = String(headerParams["stark-key"]);
      }
    }

    context.logger.debug(
      JSON.stringify({
        headers,
        message: "Header config before request to out side",
      })
    );
    return <RawAxiosRequestHeaders>headers || {};
  }
}
