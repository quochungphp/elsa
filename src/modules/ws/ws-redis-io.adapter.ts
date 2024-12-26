/* eslint-disable @typescript-eslint/ban-types */
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { ConfigService } from "../../shared/services/config/config.service";
import {
  INestApplicationContext,
  Logger,
  WebSocketAdapter,
} from "@nestjs/common";
import socketio from "socket.io";
import { WsStateService } from "./ws-state.service";
import { WsRedisDispatcherService } from "./ws-redis-dispatcher.service";

export class WebSocketRedisIOAdapter
  extends IoAdapter
  implements WebSocketAdapter
{
  private serviceName = WebSocketRedisIOAdapter.name;
  private logger = new Logger(this.serviceName);
  private adapterConstructor: ReturnType<typeof createAdapter>;
  configService: ConfigService;
  constructor(
    private readonly app: INestApplicationContext,
    private wsStateService: WsStateService,
    private wsRedisDispatcherService: WsRedisDispatcherService
  ) {
    super(app);
  }

  async connectToRedis(configService: ConfigService): Promise<void> {
    this.configService = configService;
    const {
      redisHost: host,
      redisPort: port,
      redisPassword: password,
    } = configService;
    /**
     * `redis[s]://[[username][:password]@][host][:port][/db-number]`
     * See [`redis`](https://www.iana.org/assignments/uri-schemes/prov/redis) and [`rediss`](https://www.iana.org/assignments/uri-schemes/prov/rediss) IANA registration for more details
     */
    const ssl = ["test", "local"].includes(this.configService.env)
      ? "redis"
      : "rediss";

    const config = {
      password: password,
      url: `${ssl}://${host}:${port}`,
    };
    this.logger.log(`Config redis adapter with ${config.url}, ssl :${ssl}`);

    const pubClient = createClient(config);
    const subClient = pubClient.duplicate();

    const [pub, sub] = await Promise.all([
      pubClient.connect(),
      subClient.connect(),
    ]);

    if (pub) {
      this.logger.log(`RedisIo publisher connected successfully`);
    }
    if (sub) {
      this.logger.log(`RedisIo subscriber connected successfully`);
    }

    this.adapterConstructor = createAdapter(pubClient, subClient);

    this.logger.log(`Establish redis pub/sub`);
  }

  createIOServer(port: number, options?: ServerOptions): socketio.Server {
    const server = <socketio.Server>super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);

    // Init web socket server
    this.wsRedisDispatcherService.injectSocketServer(server);
    // TODO implement socket authenticate
    this.logger.log(`Start using Redis IO Web Socket. Port: ${port}`);
    return server;
  }

  public bindClientConnect(server: socketio.Server, callback: Function): void {
    server.on("connection", (socket) => {
      if (socket.handshake.auth || socket.id) {
        socket.on("disconnect", () => {
          socket.removeAllListeners("disconnect");
        });
      }
      callback(socket);
    });
  }
}
