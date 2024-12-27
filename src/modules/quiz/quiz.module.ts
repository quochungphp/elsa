import { Module } from "@nestjs/common";
import { SharedWsModule } from "../../shared/shared.module";
import { QuizLeaveHandler } from "./handlers/quiz-leave.handler";
import { QuizJoinHandler } from "./handlers/quiz-join.handler";
import { QuizGateway } from "./quiz.gateway";
import { QuizListHandler } from "./handlers/quiz-list.handler";
const handlers = [
  QuizGateway,
  QuizLeaveHandler,
  QuizJoinHandler,
  QuizListHandler,
];
@Module({
  imports: [SharedWsModule],
  providers: handlers,
  exports: handlers,
})
export class QuizModule {}
