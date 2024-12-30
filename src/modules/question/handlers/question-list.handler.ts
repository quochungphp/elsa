import { Injectable, Logger } from "@nestjs/common";
import { QuestionRepository } from "../question.repository";
import { Question } from "../question.schema";

@Injectable()
export class QuestionListHandler {
  logger: Logger = new Logger(QuestionListHandler.name);

  constructor(private questionRepository: QuestionRepository) {}

  async execute(args: { quizId: string }): Promise<Question[]> {
    try {
      return this.questionRepository.findAllById(args.quizId);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
