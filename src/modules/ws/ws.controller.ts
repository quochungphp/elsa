import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ConfigService } from "../../shared/services/config/config.service";

@Controller()
@ApiTags("App")
export class WebsocketController {
  constructor(private readonly configService: ConfigService) {}

  @ApiOperation({
    summary: "Health check then return the semantic version of service",
  })
  @Get()
  getVersion(): { [key: string]: string } {
    const { apiSemanticVersion } = this.configService;

    return { apiSemanticVersion };
  }
}
