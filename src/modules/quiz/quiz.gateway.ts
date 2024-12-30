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
import { QuizJoinDto } from "./types/quiz.dto";
import { QuizJoinHandler } from "./handlers/quiz-join.handler";
import { QuizLeaveHandler } from "./handlers/quiz-leave.handler";
import { WsBaseGateway } from "../ws/ws-base.gateway";
import { QuizListHandler } from "./handlers/quiz-list.handler";
import { QuizSubmitHandler } from "./handlers/quiz-submit.handler";

const { corsAllowedOriginSocketConnection } = new ConfigService();
@WebSocketGateway({
  cors: {
    origin: corsAllowedOriginSocketConnection,
  },
})
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class QuizGateway extends WsBaseGateway {
  logger: Logger = new Logger(QuizGateway.name);

  @Inject()
  private quizJoinHandler: QuizJoinHandler;

  @Inject()
  private quizLeaveHandler: QuizLeaveHandler;

  @Inject()
  private quizListHandler: QuizListHandler;
  @Inject()
  private quizSubmitHandler: QuizSubmitHandler;

  @Inject()
  configService: ConfigService;

  @SubscribeMessage(WebSocketEvent.JOIN_QUIZ)
  async joinQuiz(
    socket: Socket,
    args: QuizJoinDto
  ): Promise<WebSocketResponse> {
    const param = Object.assign(new QuizJoinDto(), args);
    const errors = await this.wsClassValidator(param);

    if (errors && errors.length) {
      this.wsError(socket, errors);
    }
    const { quizId } = param;
    const data = await this.quizJoinHandler.execute(socket, args);
    const response = this.wsResponse(data);
    this.notifyQuizChange(data, WebSocketEvent.QUIZ_CHANGE, quizId);
    socket.join(quizId);

    this.logger.log(`The client id: ${socket.id} joined quizId ${quizId}`);
    return response;
  }

  @SubscribeMessage(WebSocketEvent.QUIZ_LIST)
  async quizzes(socket: Socket): Promise<WebSocketResponse> {
    const data = await this.quizListHandler.execute();
    const response = this.wsResponse(data);
    this.logger.log(`The client id: ${socket.id} gets quizzes`);
    return response;
  }

  @SubscribeMessage(WebSocketEvent.LEAVE_QUIZ)
  async leaveQuiz(socket: Socket, args: any): Promise<WebSocketResponse> {
    const data = await this.quizLeaveHandler.execute(socket, args);
    // broad cast all user in quizId room when new user join
    const quizId = data.id.toString();
    const response = this.wsResponse(data);
    socket.leave(quizId);
    this.notifyQuizChange(data, WebSocketEvent.QUIZ_CHANGE, quizId);
    return response;
  }
  @SubscribeMessage(WebSocketEvent.QUIZ_SUBMIT)
  async submitQuiz(socket: Socket, args: any): Promise<WebSocketResponse> {
    const data = await this.quizSubmitHandler.execute(socket, args);
    // broad cast all user in quizId room when new user join
    const quizId = data.result.quiz.id.toString();
    const response = this.wsResponse(data);
    this.notifyQuizChange(data, WebSocketEvent.QUIZ_CHANGE, quizId);
    // Realtime update
    this.server.emit(WebSocketEvent.LEADERBOARD_SCORE_UPDATE, response);
    return response;
  }
  private notifyQuizChange(
    quiz: any,
    eventName = WebSocketEvent.QUIZ_CHANGE,
    quizId?: string
  ) {
    if (quizId) {
      // Notify other participants in the room
      this.notifyQuizChangeInRoom(quizId, quiz);
    }
    // Broadcast to all clients to refresh their list
    this.server.emit(eventName, this.wsResponse([quiz]));
  }
  private notifyQuizChangeInRoom(roomId: string, quiz: any) {
    // Notify other participants in the room
    this.server.to(roomId).emit(roomId, this.wsResponse(quiz));
  }
}
