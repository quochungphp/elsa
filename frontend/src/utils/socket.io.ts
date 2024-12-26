import { io, Socket } from "socket.io-client";
import { getWsUrl } from "../utils/envs";

export const socket: Socket = io(getWsUrl(), {
  autoConnect: false,
  withCredentials: true,
  transports : ['websocket'] 
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};
