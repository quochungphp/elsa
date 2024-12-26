import { Inject, Injectable, Logger } from "@nestjs/common";
import { Socket } from "socket.io";
import { RedisService } from "../../shared/services/redis/redis.service";
import { redisUserCacheKey, userConnectionKey } from "../../utils/generate-key";
import { v4 as uuidv4 } from "uuid";
import { REDIS_CACHE_1_DAY } from "../../utils/types";
import { WebSocketSession } from "./ws.type";
import { WsConnectionDto } from "./dtos/ws-connection.dto";
import { AppRequest } from "../../utils/app-request";
/**
 * This is instance memory
 * consider move to redis memory or others
 */
@Injectable()
export class WsStateService {
  logger = new Logger(WsStateService.name);
  @Inject()
  private redisService: RedisService;

  /*
   * Socket state use for manage users connected in instance
   * And apply redis to share user information
   */
  private socketState = new Map<string, Socket[]>();

  public async remove(userId: string, socket: Socket): Promise<boolean> {
    const userKey = redisUserCacheKey(userId);

    const existingSockets = this.socketState.get(userId);
    this.logger.log(`The user client ${userId} was disconnected`);
    if (!existingSockets) {
      return false;
    }

    const sockets = existingSockets.filter((s) => s.id !== socket.id);
    if (!sockets.length || sockets.length === 0) {
      const { email } = existingSockets[0].data;
      const userConnectProjectId = userConnectionKey({
        email,
        refId: userId,
      });
      // Clear user session
      this.socketState.delete(userId);
      await this.redisService.deleteValue(userKey);
      await this.redisService.deleteValue(userConnectProjectId);
    } else {
      this.socketState.set(userKey, sockets);
      await this.redisService.setValue(userKey, socket.data);
    }
    return true;
  }

  public async add(
    socket: Socket,
    data: WsConnectionDto,
    sessionId?: string
  ): Promise<WebSocketSession> {
    const { email, name, refId } = data;

    const socketClientId = socket.id;

    socket.data["email"] = email || "";
    socket.data["name"] = name || "";
    socket.data["refId"] = refId || "";
    socket.data["socketClientId"] = socketClientId;
    socket.data["sessionId"] = sessionId ? sessionId : uuidv4(); // refresh or new session

    // Add new client id to list
    const existingSockets = this.getSocketClientById(socketClientId);
    const sockets = [...existingSockets, socket];
    this.socketState.set(socketClientId, sockets);

    await this.redisService.setValue(
      userConnectionKey(data),
      socketClientId,
      REDIS_CACHE_1_DAY
    );
    await this.redisService.setValue(
      redisUserCacheKey(socketClientId),
      socket.data,
      REDIS_CACHE_1_DAY
    );

    return <WebSocketSession>socket.data;
  }

  public get(userId: string): Socket[] {
    return this.socketState.get(userId) || [];
  }
  public async getUserSession(
    userId: string
  ): Promise<WebSocketSession | undefined> {
    const userKey = redisUserCacheKey(userId);
    return this.redisService.getValue<WebSocketSession>(userKey);
  }

  public async updateUserSession(
    userId: string,
    newUserSessionInfo: WebSocketSession
  ): Promise<void> {
    const userKey = redisUserCacheKey(userId);
    await this.redisService.setValue(userKey, newUserSessionInfo);
  }

  public async getUserClientId(
    query: WsConnectionDto
  ): Promise<string | undefined> {
    const userKey = userConnectionKey(query);
    return this.redisService.getValue<string>(userKey);
  }

  public async getConnectedUserSession(
    query: WsConnectionDto
  ): Promise<WebSocketSession | undefined> {
    const clientId = await this.getUserClientId(query);

    if (clientId) {
      const userSession = await this.getUserSession(clientId);
      return userSession;
    }
  }

  public async refreshUserSession(
    oldClientId: string,
    data: WsConnectionDto,
    socketClient: Socket
  ): Promise<WebSocketSession> {
    // Get previous session info
    const clientSockets = this.getSocketClientById(oldClientId);

    // Replace with new socket
    if (clientSockets.length > 0) {
      this.socketState.delete(oldClientId);
    }

    // Add new client id to list
    await this.redisService.deleteValue(redisUserCacheKey(oldClientId));
    await this.add(socketClient, data);
    return <WebSocketSession>socketClient.data;
  }

  public getSocketClientById(clientId: string): Socket[] {
    return this.socketState.get(clientId) || [];
  }

  public getAll(): Socket[] {
    const all = [] as any;
    this.socketState.forEach((sockets) => all.push(sockets));

    return all;
  }

  public async getUserConnectedByKey(key: string): Promise<any> {
    return this.redisService.getValue(key);
  }
}
