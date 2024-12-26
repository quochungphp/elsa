import { Injectable, Logger } from "@nestjs/common";
import { QuizRepository } from "../../modules/quiz/quiz.repository";
import { QuestionRepository } from "../../modules/question/question.repository";
import { UserRepository } from "../../modules/user/user.repository";
import { ScoreRepository } from "../../modules/score/score.repository";
import { Types } from "mongoose";

@Injectable()
export class SeedService {
  logger: Logger = new Logger(SeedService.name);

  constructor(
    private quizRepository: QuizRepository,
    private questionRepository: QuestionRepository,
    private userRepository: UserRepository,
    private scoreRepository: ScoreRepository
  ) {}

  async seed() {
    const countQuizzes = await this.quizRepository.QuizModel.countDocuments();
    try {
      const userIds: any[] = [];
      const users: any[] = [];
      if (countQuizzes === 0) {
        // Users
        for (let i = 0; i < 4; i++) {
          const u = await this.userRepository.UserModel.create({
            name: `User - ${i}`,
            email: `email_user_${i}@localhost.com`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
          userIds.push([new Types.ObjectId(u.id)]);
          users.push(u);
        }

        // Quizzes
        for (let i = 1; i < 5; i++) {
          const q = await this.quizRepository.QuizModel.create({
            title: `English Quiz - ${i}`,
            participants: userIds,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
          // Scores
          await this.scoreRepository.ScoreModel.create({
            quiz: q,
            user: users[Math.floor(Math.random() * userIds.length)],
            score: Math.floor(Math.random() * 10), // 0 - 10
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });

          // Questions
          const questions: any[] = [];
          for (let j = 1; j <= 10; j++) {
            questions.push({
              quizId: q.id,
              questionText: `What is corrected answer of question ${i}`, // Question text
              options: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
              correctAnswer: Math.floor(Math.random() * 4),
            });
          }
          await this.questionRepository.QuestionModel.insertMany(questions);
        }
        this.logger.log("Seeding completed!");
      } else {
        this.logger.log("Seeding no data!");
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
