import { Module } from "@nestjs/common";
import { SharedWsModule } from "../../shared/shared.module";
import { UserJoinHandler } from "./handlers/user-join.handler";
import { UserGateway } from "./user.gateway";

const handlers = [UserGateway, UserJoinHandler];
@Module({
  imports: [SharedWsModule],
  providers: handlers,
  exports: handlers,
})
export class UserModule {}
