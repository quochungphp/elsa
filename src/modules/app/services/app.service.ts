import { Injectable } from "@nestjs/common";
import { ConfigService } from "../../../shared/services/config/config.service";

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getVersion(): { [key: string]: string } {
    const { apiSemanticVersion } = this.configService;

    return { apiSemanticVersion };
  }
}
