import {
  Inject,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { ConfigService } from "../../shared/services/config/config.service";
import { WebsocketExceptionsFilter } from "../../utils/exceptions/base-ws-exception";
import { WebSocketEvent, WebSocketResponse } from "../ws/ws.type";
import { WsBaseGateway } from "../ws/ws-base.gateway";
import { QuestionListHandler } from "./handlers/question-list.handler";

const { corsAllowedOriginSocketConnection } = new ConfigService();
@WebSocketGateway({
  cors: {
    origin: corsAllowedOriginSocketConnection,
  },
})
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class QuestionGateway extends WsBaseGateway {
  logger: Logger = new Logger(QuestionGateway.name);

  @Inject()
  private questionListHandler: QuestionListHandler;

  @Inject()
  configService: ConfigService;

  @SubscribeMessage(WebSocketEvent.QUESTION_LIST)
  async questionList(socket: Socket, args: any): Promise<WebSocketResponse> {
    const data = await this.questionListHandler.execute(args);
    const response = this.wsResponse(data);
    this.logger.log(`The client id: ${socket.id} gets questions`);
    return response;
  }
}
