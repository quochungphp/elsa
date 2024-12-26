import {
  Inject,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
  forwardRef,
} from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { ConfigService } from "../../shared/services/config/config.service";
import { WebsocketExceptionsFilter } from "../../utils/exceptions/base-ws-exception";
import { WebSocketEvent, WebSocketResponse } from "../ws/ws.type";
import { WsSocketGateway } from "../ws/ws.gateway";
import { CoreError } from "../../utils/exceptions/const";
import { ScoreRepository } from "../score/score.repository";

const { corsAllowedOriginSocketConnection } = new ConfigService();
@WebSocketGateway({
  cors: {
    origin: corsAllowedOriginSocketConnection,
  },
})
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class LeaderboardGateway extends WsSocketGateway {
  logger: Logger = new Logger(WebSocketGateway.name);

  @Inject()
  configService: ConfigService;

  @Inject()
  private scoreRepository: ScoreRepository;

  @SubscribeMessage(WebSocketEvent.LEADERBOARD_LIST)
  async fetchMyWagers(socket: Socket): Promise<WebSocketResponse> {
    const scores = await this.scoreRepository.findAll();
    const response = this.wsResponse(scores);
    return response;
  }
}
