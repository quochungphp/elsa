import { Injectable, Logger } from "@nestjs/common";
import { Socket } from "socket.io";
import { WsStateService } from "../../ws/ws-state.service";
import { QuizJoinDto, QuizSubmitDto } from "../types/quiz.dto";
import { Quiz } from "../quiz.schema";
import { CoreException } from "../../../utils/exceptions/core-exception";
import { CoreError } from "../../../utils/exceptions/const";
import { QuizRepository } from "../quiz.repository";
import { UserRepository } from "../../user/user.repository";
import { ScoreRepository } from "../../score/score.repository";
import { Score } from "../../score/score.schema";
import { QuestionRepository } from "../../question/question.repository";

@Injectable()
export class QuizSubmitHandler {
  logger: Logger = new Logger(QuizSubmitHandler.name);

  constructor(
    private quizRepository: QuizRepository,
    private userRepository: UserRepository,
    private questionRepository: QuestionRepository,
    private scoreRepository: ScoreRepository,
    private wsStateService: WsStateService
  ) {}

  async execute(
    socket: Socket,
    args: QuizSubmitDto
  ): Promise<{ result: Score; quizzes: Score[] }> {
    const { quizId, userId, answers } = args;
    const questionIds = Object.keys(answers);
    const correctAnswer = new Map();
    let score = 0;

    try {
      let quiz = await this.quizRepository.findById(quizId);

      if (!quiz) {
        throw new CoreException(CoreError.QUIZ_NOT_FOUND);
      }
      const userSession = await this.wsStateService.getUserSession(socket.id);

      if (!userSession) {
        throw new CoreException(CoreError.USER_SESSION_NOT_FOUND);
      }

      const exitedUser = quiz.participants.find((p) =>
        p?.userId?.equals(userId)
      );
      const questions = await this.questionRepository.QuestionModel.find({
        id: { $in: questionIds },
      });
      if (questions.length) {
        for (const q of questions) {
          if (
            correctAnswer.get(q.id) &&
            correctAnswer.get(q.id) === q.correctAnswer
          ) {
            score++;
          }
        }
      }
      const result = await this.scoreRepository.ScoreModel.create({
        quiz: quiz,
        user: exitedUser,
        score,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      const quizzes = await this.scoreRepository.ScoreModel.find({ quiz }).sort(
        { score: -1, createdAt: 1 }
      );
      return {
        result,
        quizzes,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
