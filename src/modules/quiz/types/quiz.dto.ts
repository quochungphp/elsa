import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";

export class QuizJoinDto {
  @IsString()
  userId: string;

  @IsString()
  quizId: string;
}

class AnswerDto {
  @IsNumber()
  value: number;
}

export class QuizSubmitDto {
  @IsString()
  userId: string;

  @IsString()
  quizId: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: { [key: string]: AnswerDto };
}
