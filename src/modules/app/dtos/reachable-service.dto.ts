import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class ReachableServiceDto {
  @ApiPropertyOptional({
    description: " server url to verify the connection from our service",
    default: "https://google.com",
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  gameServerUrl: string;
}
