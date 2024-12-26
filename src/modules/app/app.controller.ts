import { Controller, Get, Query, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppService } from "./services/app.service";
import { AppRequest } from "../../utils/app-request";
import { ReachableServiceDto } from "./dtos/reachable-service.dto";

@Controller()
@ApiTags("App")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: "Health check then return the semantic version of service",
  })
  @Get()
  getVersion(): { [key: string]: string } {
    return this.appService.getVersion();
  }

  @ApiOperation({
    summary: "Verify reachable status to a server url from PvP service",
  })
  @Get("reachable")
  async getReachableService(
    @Req() request: AppRequest,
    @Query() query: ReachableServiceDto
  ): Promise<any> {
    const { gameServerUrl } = query;
    // return this.resourceApiService.healthCheck(request, gameServerUrl);
  }
}
