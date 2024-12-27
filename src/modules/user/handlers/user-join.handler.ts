import { Injectable, Logger } from "@nestjs/common";
import { Socket } from "socket.io";
import { WsStateService } from "../../ws/ws-state.service";
import { CoreException } from "../../../utils/exceptions/core-exception";
import { CoreError } from "../../../utils/exceptions/const";
import { UserRepository } from "../user.repository";
import { UserJoinDto } from "../types/user.dto";
import { User } from "../user.schema";

@Injectable()
export class UserJoinHandler {
  logger: Logger = new Logger(UserJoinHandler.name);

  constructor(
    private userRepository: UserRepository,
    private wsStateService: WsStateService
  ) {}

  async execute(socket: Socket, args: UserJoinDto): Promise<User> {
    const { email, name } = args;

    try {
      let user = await this.userRepository.UserModel.findOne({ email });
      const userSession = await this.wsStateService.getUserSession(socket.id);

      if (!userSession) {
        throw new CoreException(CoreError.USER_SESSION_NOT_FOUND);
      }
      if (user) {
        return user;
      }
      return this.userRepository.create({ email, name });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
