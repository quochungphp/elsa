import { Module } from "@nestjs/common";
import { SharedWsModule } from "../../shared/shared.module";
import { QuizLeaveHandler } from "./handlers/quiz-leave.handler";
import { QuizJoinHandler } from "./handlers/quiz-join.handler";
import { QuizGateway } from "./quiz.gateway";
const handlers = [QuizGateway, QuizLeaveHandler, QuizJoinHandler];
@Module({
  imports: [SharedWsModule],
  providers: handlers,
  exports: handlers,
})
export class QuizModule {}
