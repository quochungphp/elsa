import { v4 as uuidv4 } from "uuid";
import { WsConnectionDto } from "../modules/ws/dtos/ws-connection.dto";

export const redisCacheKey = (cacheKey = uuidv4()): string => {
  return `elsa:redis:cache:${cacheKey}`;
};
export const ssmServerStatusNameCacheKey = (): string => {
  return `elsa:ssm:serverStatusName`;
};

export const redisUserCacheKey = (cacheKey = uuidv4()): string => {
  return `elsa:user:${cacheKey}`;
};

export const userConnectionKey = (
  query: WsConnectionDto,
  wsClientId?: string
): string => {
  const { email } = query;
  return `elsa:connected:${wsClientId}:${email}`;
};

export const senderNonceKey = (starkKey: string): string => {
  return `elsa:sender-nonce:${starkKey}`;
};

export const redisPvPCacheKey = (cacheKey: string): string => {
  return `elsa:pvp:${cacheKey}`;
};
