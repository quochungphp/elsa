import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import {
  Inject,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Socket } from "socket.io";
import { WsStateService } from "./ws-state.service";
import { RedisService } from "../../shared/services/redis/redis.service";
import { WebsocketExceptionsFilter } from "../../utils/exceptions/base-ws-exception";
import { WebSocketEvent, WebSocketSession } from "./ws.type";
import { WsRedisDispatcherService } from "./ws-redis-dispatcher.service";
import { ConfigService } from "../../shared/services/config/config.service";
import { WsConnectionDto } from "./dtos/ws-connection.dto";
import { CoreError } from "../../utils/exceptions/const";
import { WsBaseGateway } from "./ws-base.gateway";
/**
 * This is same API controller
 */
@WebSocketGateway({
  cors: true,
  transports: ["websocket", "polling"],
})
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class WsSocketGateway
  extends WsBaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  public logger: Logger = new Logger(WebSocketGateway.name);
  @Inject()
  protected wsStateService: WsStateService;

  @Inject()
  protected wsRedisDispatcherService: WsRedisDispatcherService;

  @Inject()
  protected redisService: RedisService;

  @Inject()
  protected configService: ConfigService;

  afterInit(client: Socket) {
    this.logger.log("Initialized .....");
    // Ws Middleware
    client.use((req: any, next) => {
      this.logger.log({
        handshake: JSON.stringify(req.handshake),
        message: `Client id ${req.id} request establish connection`,
      });
      return next();
    });
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client request connect: ${client.id}`);
    const query = <WsConnectionDto>(<unknown>client.handshake.query);
    const { refId } = query;
    // Validate connection params
    const param: WsConnectionDto = Object.assign(new WsConnectionDto(), query);
    const errors = await this.wsClassValidator(param);
    if (errors && errors.length) {
      this.wsError(client, errors);
      return;
    }

    const existingClientId = await this.wsStateService.getUserClientId(query);
    let session: WebSocketSession;
    if (existingClientId) {
      // User does not request reconnect
      if (!refId) {
        this.wsError(client, CoreError.AUTH_SESSION_EXISTED);
        return;
      }
      // Refresh the session using existing or new session id
      session = await this.wsStateService.refreshUserSession(
        existingClientId,
        query,
        client
      );
    } else {
      session = await this.wsStateService.add(client, query);
    }
    try {
      // Broadcast response to specific clientId
      const response = this.wsResponse({ session });
      return this.server.to(client.id).emit(WebSocketEvent.CONNECTED, response);
    } catch (error) {
      this.wsError(client, errors);
      return;
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
