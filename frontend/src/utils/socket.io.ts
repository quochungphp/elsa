import { io, Socket } from "socket.io-client";
import { getWsUrl } from "../utils/envs";
import { v4 as uuidv4 } from "uuid";

export const socket: Socket = io(getWsUrl() + `?refId=${uuidv4()}`, {
  autoConnect: false,
  withCredentials: true,
  transports : ['websocket'] 
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};
