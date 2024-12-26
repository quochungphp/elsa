import { IsString } from "class-validator";

export class QuizJoinDto {
  @IsString()
  userId: string;

  @IsString()
  quizId: string;
}
