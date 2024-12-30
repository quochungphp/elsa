import { Injectable, Logger } from "@nestjs/common";
import Redis, { RedisOptions } from "ioredis";
import { Observable, Observer } from "rxjs";
import { filter, map } from "rxjs/operators";
import { ConfigService } from "../config/config.service";
@Injectable()
export class RedisService {
  logger = new Logger(RedisService.name);
  private readonly redisMaster: Redis;
  private readonly redisReplica: Redis;
  private readonly redisSubscriberClient: Redis;
  private readonly redisPublisherClient: Redis;

  constructor(configService: ConfigService) {
    const {
      redisHost: host,
      redisPort: port,
      redisPassword: password,
      redisReplicaHost,
    } = configService;

    const option: RedisOptions = {
      host,
      port,
      password,
    };

    if (configService.isEnableRedisTLS) {
      option.tls = {};
    }

    this.redisReplica = new Redis({
      ...option,
      host: redisReplicaHost,
      role: "slave",
    });
    this.redisMaster = new Redis({ ...option, role: "master" });
    this.redisPublisherClient = new Redis({ ...option, role: "master" });
    this.redisSubscriberClient = new Redis({
      ...option,
      host: redisReplicaHost,
      role: "slave",
    });
    this.logger.log(
      `redisReplicaHost = ${redisReplicaHost} with option = ${JSON.stringify(
        option
      )}`
    );
    this.redisPublisherClient.on("error", (error) => {
      this.logger.error(
        JSON.stringify({
          redis: "master",
          error,
          name: "redisPublisherClient",
        })
      );
    });
    this.redisSubscriberClient.on("error", (error) => {
      this.logger.error(
        JSON.stringify({
          redis: "slave",
          error,
          name: "redisSubscriberClient",
        })
      );
    });
    this.redisMaster.on("error", (error) => {
      this.logger.error(
        JSON.stringify({
          redis: "master",
          error,
        })
      );
    });
    this.redisReplica.on("error", (error) => {
      this.logger.error(
        JSON.stringify({
          redis: "replica",
          error,
        })
      );
    });
    this.redisReplica.on("connect", () => {
      this.logger.log("Connected to redis replica instance");
    });
    this.redisMaster.on("connect", () => {
      this.logger.log("Connected to redis master instance");
    });
    this.redisPublisherClient.on("connect", () => {
      this.logger.log("Connected to redis publisher instance");
    });
    this.redisSubscriberClient.on("connect", () => {
      this.logger.log("Connected to redis subscriber instance");
    });
  }

  get writer(): Redis {
    return this.redisMaster;
  }

  get reader(): Redis {
    return this.redisReplica;
  }

  async setValue(key: string, value: any, expireTime?: number) {
    const serializedValue = JSON.stringify(value);
    if (expireTime) {
      await this.redisMaster.setex(key, expireTime, serializedValue);
    } else {
      await this.redisMaster.set(key, serializedValue);
    }
  }

  async getValue<T>(key: string): Promise<T | undefined> {
    const value = await this.redisReplica.get(key);
    return value ? JSON.parse(value) : undefined;
  }

  async deleteValue(key: string) {
    await this.redisMaster.del(key);
  }

  async deleteItemsByPrefixKey(itemPrefix = ""): Promise<string[] | undefined> {
    const pattern = `${itemPrefix}*`;
    const keys = await this.redisMaster.keys(pattern);

    if (!keys || !keys.length) {
      return;
    }

    for (const key of keys) {
      await this.deleteValue(key);
    }

    return keys;
  }

  async getItemsByPrefixKey(itemPrefix = ""): Promise<string[] | undefined> {
    const pattern = `${itemPrefix}*`;
    const keys = await this.redisMaster.keys(pattern);

    if (!keys || !keys.length) {
      return;
    }

    return keys;
  }

  /**
   * Utility function to get item and also cache that item
   *
   * @param cacheKey
   * @param getItem
   * @returns
   */
  async getItemWithCache<T>(
    getCacheKey: () => string,
    getItem: () => Promise<T | undefined>
  ): Promise<T | undefined> {
    const cacheKey = getCacheKey();
    const cachedItem = await this.getValue<T>(cacheKey);
    if (!cachedItem) {
      const item = await getItem();
      if (item) {
        this.setValue(cacheKey, item);
      }
      return item;
    }
    return cachedItem;
  }

  async flushAll() {
    return this.redisMaster.flushall();
  }
  async incr(key: string): Promise<number> {
    return this.redisMaster.incr(key);
  }
  public fromEvent(eventName: string): Observable<any> {
    this.redisSubscriberClient.subscribe(eventName);

    return Observable.create((observer: Observer<any>) =>
      this.redisSubscriberClient.on("message", (channel, message) =>
        observer.next({ channel, message })
      )
    ).pipe(
      filter(({ channel }) => channel === eventName),
      map(({ message }) => JSON.parse(message))
    );
  }

  public async publish(channel: string, value: unknown): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      return this.redisPublisherClient.publish(
        channel,
        JSON.stringify(value),
        (error, reply) => {
          if (error) {
            return reject(error);
          }

          return resolve(reply as any);
        }
      );
    });
  }
}
