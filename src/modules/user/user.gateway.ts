import {
  Inject,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
  forwardRef,
} from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { ConfigService } from "../../shared/services/config/config.service";
import { WebsocketExceptionsFilter } from "../../utils/exceptions/base-ws-exception";
import { WebSocketEvent, WebSocketResponse } from "../ws/ws.type";
import { WsSocketGateway } from "../ws/ws.gateway";
import { UserJoinDto } from "./types/user.dto";
import { UserJoinHandler } from "./handlers/user-join.handler";
import { WsBaseGateway } from "../ws/ws-base.gateway";

const { corsAllowedOriginSocketConnection } = new ConfigService();
@WebSocketGateway({
  cors: {
    origin: corsAllowedOriginSocketConnection,
  },
})
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class UserGateway extends WsBaseGateway {
  logger: Logger = new Logger(UserGateway.name);

  @Inject()
  private userJoinHandler: UserJoinHandler;

  @Inject()
  configService: ConfigService;

  @SubscribeMessage(WebSocketEvent.USER_JOIN)
  async joinUser(
    socket: Socket,
    args: UserJoinDto
  ): Promise<WebSocketResponse> {
    const param = Object.assign(new UserJoinDto(), args);
    const errors = await this.wsClassValidator(param);

    if (errors && errors.length) {
      this.wsError(socket, errors);
    }
    const data = await this.userJoinHandler.execute(socket, args);
    const response = this.wsResponse(data);
    this.logger.log(
      `The client id: ${socket.id} joined by email ${param.email}`
    );
    return response;
  }
}
