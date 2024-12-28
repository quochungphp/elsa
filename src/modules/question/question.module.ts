import { Module } from "@nestjs/common";
import { SharedWsModule } from "../../shared/shared.module";
import { QuestionGateway } from "./question.gateway";
import { QuestionListHandler } from "./handlers/question-list.handler";

const handlers = [
  QuestionGateway,
  QuestionListHandler
];
@Module({
  imports: [SharedWsModule],
  providers: handlers,
  exports: handlers,
})
export class QuestionModule {}
