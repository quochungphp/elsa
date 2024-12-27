import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Inject, Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { WsStateService } from "./ws-state.service";
import {
  WebSocketErrorResponse,
  WebSocketEvent,
  WebSocketResponse,
} from "./ws.type";
import { WsRedisDispatcherService } from "./ws-redis-dispatcher.service";
import { ValidationError, validate } from "class-validator";

export class WsBaseGateway {
  public logger: Logger = new Logger(WebSocketGateway.name);
  @Inject()
  protected wsStateService: WsStateService;

  @Inject()
  protected wsRedisDispatcherService: WsRedisDispatcherService;

  @WebSocketServer() server: Server;

  private async disconnect(socket: Socket) {
    this.logger.log(`Exception server disconnect socketId: ${socket.id}`);
    socket.disconnect();
  }

  protected wsResponse(data: any): WebSocketResponse {
    return {
      status: "success",
      data: data,
    };
  }

  protected wsError(socket: Socket, data: any) {
    const errors = Array.isArray(data) ? data : [data];
    const errorResponse: WebSocketErrorResponse = {
      status: "error",
      errors,
    };
    socket.emit(WebSocketEvent.ERROR, errorResponse);
    this.disconnect(socket);
  }

  protected async wsClassValidator(
    params: any
  ): Promise<ValidationError[] | null> {
    const errorsDto: ValidationError[] = await validate(params);

    if (errorsDto.length > 0) {
      const errorResponse: any = [];
      for (const error of errorsDto) {
        if (error.constraints) {
          errorResponse.push(Object.values(error.constraints).shift());
        }
      }
      return errorResponse;
    }
    return null;
  }
}
