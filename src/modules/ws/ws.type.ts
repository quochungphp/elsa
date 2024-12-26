import socketio from "socket.io";

interface TokenPayload {
  readonly clientId: string;
}

export interface AuthenticatedSocket extends socketio.Socket {
  auth: TokenPayload;
}

export enum WebSocketEvent {
  ERROR = "ERROR",
  CONNECTED = "CONNECTED",
  RE_CONNECT = "RE_CONNECT",
  JOIN_QUIZ = "JOIN_QUIZ",
  RE_JOIN_QUIZ = "RE_JOIN_QUIZ",
  CREATE_QUIZ = "CREATE_QUIZ",
  LEAVE_QUIZ = "LEAVE_QUIZ",
  START_QUIZ = "START_QUIZ",
  LIST_QUIZ = "LIST_QUIZ",
  MY_QUIZ = "MY_QUIZ",
  CONFIRMING_QUIZ = "CONFIRMING_QUIZ",
  START_MATCH_QUIZ = "START_MATCH_QUIZ",
  END_MATCH_QUIZ = "END_MATCH_QUIZ",
  QUIZ_CHANGE = "QUIZ_CHANGE",
  QUIZ_ADD = "QUIZ_ADD",
  LEADERBOARD_LIST = "LEADERBOARD_LIST",
}

export interface WebSocketSession {
  email: string;
  name: string;
  socketClientId: number;
  sessionId: string;
  refId: string;
  quizId: string;
}

export interface WebSocketResponse<T = any> {
  status: string;
  data: T;
}

export interface WebSocketErrorResponse<T = any> {
  status: string;
  errors: T[];
}
