import { Injectable, Logger } from "@nestjs/common";
import { Quiz } from "../quiz.schema";
import { QuizRepository } from "../quiz.repository";

@Injectable()
export class QuizListHandler {
  logger: Logger = new Logger(QuizListHandler.name);

  constructor(private quizRepository: QuizRepository) {}

  async execute(): Promise<Quiz[]> {
    try {
      return this.quizRepository.findAll();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
