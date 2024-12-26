import { Injectable, Logger } from "@nestjs/common";
import { Socket } from "socket.io";
import { WsStateService } from "../../ws/ws-state.service";
import { QuizJoinDto } from "../types/quiz.dto";
import { Quiz } from "../quiz.schema";
import { CoreException } from "../../../utils/exceptions/core-exception";
import { CoreError } from "../../../utils/exceptions/const";
import { QuizRepository } from "../quiz.repository";
import { UserRepository } from "../../user/user.repository";

@Injectable()
export class QuizLeaveHandler {
  logger: Logger = new Logger(QuizLeaveHandler.name);

  constructor(
    private quizRepository: QuizRepository,
    private userRepository: UserRepository,

    private wsStateService: WsStateService
  ) {}

  async execute(socket: Socket, args: QuizJoinDto): Promise<Quiz> {
    const { quizId, userId } = args;

    try {
      let quiz = await this.quizRepository.findById(quizId);

      if (!quiz) {
        throw new CoreException(CoreError.QUIZ_NOT_FOUND);
      }
      const userSession = await this.wsStateService.getUserSession(socket.id);

      if (!userSession) {
        throw new CoreException(CoreError.USER_SESSION_NOT_FOUND);
      }

      const exitedUser = quiz.participants.find(
        (i) => i.userId.toString() === userId
      );

      if (exitedUser) {
        return quiz;
      }
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new CoreException(CoreError.USER_NOT_FOUND);
      }
      quiz.participants.push({
        userId: user.id,
      });
      await quiz.save();
      return quiz;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
