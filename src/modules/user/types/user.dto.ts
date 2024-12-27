import { IsString } from "class-validator";

export class UserJoinDto {
  @IsString()
  email: string;

  @IsString()
  name: string;
}
