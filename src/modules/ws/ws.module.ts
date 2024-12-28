import { Module, OnModuleInit } from "@nestjs/common";
import { SharedWsModule } from "../../shared/shared.module";
import { WebsocketController } from "./ws.controller";
import { LeaderboardModule } from "../leaderboard/leaderboard.module";
import { QuizModule } from "../quiz/quiz.module";
import { SeedService } from "../../utils/seeds/seed";
import { UserModule } from "../user/user.module";
import { QuestionModule } from "../question/question.module";

@Module({
  imports: [SharedWsModule, LeaderboardModule, QuizModule, UserModule, QuestionModule],
  providers: [SeedService],
  controllers: [WebsocketController],
})
export class WsModule implements OnModuleInit {
  constructor(private seedService: SeedService) {}
  onModuleInit() {
    this.seedService.seed();
  }
}
