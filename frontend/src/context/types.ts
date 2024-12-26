import { ReactNode } from "react";

export interface WebSocketProviderProps {
  children: ReactNode;
}
export type WebSocketInstance = WebSocket | null;

export interface UseWebSocketOptions {
  email?:string;
  name?: string
}