import { Module } from "@nestjs/common";
import { LeaderboardGateway } from "./leaderboard.gateway";
import { SharedWsModule } from "shared/shared.module";
const services = [LeaderboardGateway];
@Module({
  imports: [SharedWsModule],
  providers: services,
  exports: services,
})
export class LeaderboardModule {}
