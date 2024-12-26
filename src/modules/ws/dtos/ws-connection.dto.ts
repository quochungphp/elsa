import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class WsConnectionDto {
  @ApiProperty({ description: "email use for login" })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty({ description: "custom clientId to support additional logic" })
  @IsNotEmpty()
  @IsString()
  refId: string;
}
