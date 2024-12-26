import { Injectable, Logger } from "@nestjs/common";
import { tap } from "rxjs/operators";
import { Server } from "socket.io";
import { RedisService } from "../../shared/services/redis/redis.service";
import { WsStateService } from "./ws-state.service";
import { REDIS_TYPE } from "../../shared/services/redis/redis.type";
import { WebSocketServer } from "@nestjs/websockets";
import { toWsResponse } from "../../utils/ws";
/**
 * Dispatcher
 * - Init and subscribe event
 * - Listening event name and tap to function to process
 *
 * Ref: https://rxjs.dev/guide/operators
 */
@Injectable()
export class WsRedisDispatcherService {
  @WebSocketServer() socketServer: Server;

  logger = new Logger(WsRedisDispatcherService.name);

  public constructor(
    private readonly wsStateService: WsStateService,
    private readonly redisService: RedisService
  ) {
    // Init subscribe events
    this.redisService
      .fromEvent(REDIS_TYPE.REDIS_SOCKET_EVENT_PING)
      .pipe(tap(this.consumePingEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_TYPE.REDIS_SOCKET_EVENT_SEND_NAME)
      .pipe(tap(this.consumeSendEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_TYPE.REDIS_SOCKET_EVENT_EMIT_ALL_NAME)
      .pipe(tap(this.consumeEmitToAllEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_TYPE.REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME)
      .pipe(tap(this.consumeEmitToAuthenticatedEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_TYPE.REDIS_SOCKET_SUBSCRIBE_EVENT_QUIZ_CHANGE)
      .pipe(tap(this.consumeEventQuizCompleted))
      .subscribe();

    this.logger.debug("Start Redis listen event");
  }

  public injectSocketServer(server: Server): WsRedisDispatcherService {
    this.socketServer = server;

    return this;
  }

  public get redisSocketIO(): Server {
    return this.socketServer;
  }
  // Ex: Broadcast to another Backend service
  private consumePingEvent = (eventInfo: any): void => {
    const isPing = this.socketServer.emit("ping", eventInfo);
    this.logger.log(`isPing ${isPing}, eventInfo: ${eventInfo}`);
  };

  private consumeSendEvent = (eventInfo: any): void => {
    const { userId, event, data, socketId } = eventInfo;

    return this.wsStateService
      .get(userId)
      .filter((socket) => socket.id !== socketId)
      .forEach((socket) => socket.emit(event, data));
  };

  private consumeEmitToAllEvent = (eventInfo: any): void => {
    this.socketServer.emit(eventInfo.event, eventInfo.data);
  };

  private consumeEmitToAuthenticatedEvent = (eventInfo: any): void => {
    const { event, data } = eventInfo;

    return this.wsStateService
      .getAll()
      .forEach((socket) => socket.emit(event, data));
  };

  public propagateEvent(eventInfo: any): boolean {
    if (!eventInfo.userId) {
      return false;
    }

    this.redisService.publish(
      REDIS_TYPE.REDIS_SOCKET_EVENT_SEND_NAME,
      eventInfo
    );

    return true;
  }

  public emitToAuthenticated(eventInfo: any): boolean {
    this.redisService.publish(
      REDIS_TYPE.REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME,
      eventInfo
    );

    return true;
  }

  public emitToAll(eventInfo: any): boolean {
    this.redisService.publish(
      REDIS_TYPE.REDIS_SOCKET_EVENT_EMIT_ALL_NAME,
      eventInfo
    );

    return true;
  }

  private consumeEventQuizCompleted = (eventInfo: any): boolean => {
    const { id } = eventInfo;
    const quizId = id.toString();
    const isWsEmit = this.socketServer
      .to(quizId)
      .emit(quizId, toWsResponse(eventInfo));
    this.logger.log(
      `consumeEventWagerCompleted quizId ${quizId} emit quiz completed isWsEmit: ${isWsEmit}`
    );
    return true;
  };
}
