import {
  WebSocketResponse,
  WebSocketErrorResponse,
} from "../modules/ws/ws.type";

// Utility functions to use standard WebsocketResponse | WebSocketErrorResponse
export function toWsResponse(data: any): WebSocketResponse {
  return {
    status: "success",
    data: data,
  };
}

export function toWsError(errors: any[]): WebSocketErrorResponse {
  return {
    status: "error",
    errors,
  };
}
