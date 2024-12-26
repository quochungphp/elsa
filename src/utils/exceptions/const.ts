import { HttpStatus } from "@nestjs/common";

/*
Error code from invoking MyriaCore then process updating on-demand
*/
export enum MYRIA_CORE_ERROR_CODE {
  ORDER_WAS_FULL_FILLED = 1132,
  ORDER_WAS_REMOVED = 1133,
}

/**
Project: 1000 → 1999
Asset: 2000 → 2999
Collection: 3000 → 3999
Fee: 4000 → 4999
Mint: 5000 → 5999
Order: 6000 → 6999
Trade: 7000 → 7999
User: 8000 → 8999
 */
export class CoreError {
  static readonly PROJECT_CONFLICT = new CoreError(
    1000,
    "Project conflict",
    HttpStatus.CONFLICT
  );

  static readonly SIGNABLE_ASSET_INFO_ERROR = new CoreError(
    1001,
    "Unable to fetch asset info",
    HttpStatus.INTERNAL_SERVER_ERROR
  );

  static readonly UNABLE_TO_TRANSFER_TOKEN = new CoreError(
    1001,
    "Unable to transfer token",
    HttpStatus.INTERNAL_SERVER_ERROR
  );

  static readonly PROJECT_NOT_FOUND = new CoreError(
    1002,
    "Unable to find project id {1}",
    HttpStatus.NOT_FOUND
  );

  static readonly USER_NOT_PROJECT_OWNER = new CoreError(
    1003,
    "StarkKey {1} is not the owner of project {2}",
    HttpStatus.BAD_REQUEST
  );

  static readonly MINIMUM_QUIZ_IS_GREATER_THAN_MAXIMUM = new CoreError(
    1004,
    "PvP battle minimum amount is greater than maximum",
    HttpStatus.BAD_REQUEST
  );

  static readonly QUIZ_CONFIG_EXISTED = new CoreError(
    1005,
    "Wager config for project {1} and competitorMode {2} already existed",
    HttpStatus.CONFLICT
  );

  static readonly COMPETITOR_MODE_NOT_EXIST = new CoreError(
    1006,
    "Competitor mode does not exist",
    HttpStatus.NOT_FOUND
  );

  static readonly UNABLE_TO_TRANSFER_FUND = new CoreError(
    1007,
    "Unable to transfer PvP battle fund",
    HttpStatus.INTERNAL_SERVER_ERROR
  );

  static readonly TRANSFER_AMOUNT_INSUFFICIENT = new CoreError(
    1008,
    "Amount transfer is less insufficient to create PvP battle",
    HttpStatus.NOT_FOUND
  );

  static readonly TRANSFER_REQUEST_MISSING = new CoreError(
    1009,
    "Paid PvP battle request must contain transfer request",
    HttpStatus.BAD_REQUEST
  );

  static readonly USER_SESSION_NOT_FOUND = new CoreError(
    1010,
    "User session not found",
    HttpStatus.NOT_FOUND
  );

  static readonly QUIZ_PLAYERS_LIMIT_EXCEEDED = new CoreError(
    1011,
    "Wager is already full",
    HttpStatus.BAD_REQUEST
  );

  static readonly QUIZ_NOT_AVAILABLE = new CoreError(
    1012,
    "PvP battle is not available",
    HttpStatus.BAD_REQUEST
  );

  static readonly QUIZ_NOT_READY = new CoreError(
    1013,
    "PvP battle is not ready to start",
    HttpStatus.BAD_REQUEST
  );
  static readonly QUIZ_LIMIT_BY_OVER_QUOTA = new CoreError(
    1014,
    "Number of created PvP battle is over quota",
    HttpStatus.NOT_ACCEPTABLE
  );

  static readonly QUIZ_LIMIT_QUIZ_CAN_PLAY = new CoreError(
    1015,
    "Cannot join this match. Player already in another match",
    HttpStatus.NOT_ACCEPTABLE
  );
  static readonly QUIZ_CONFIG_NOT_FOUND = new CoreError(
    1016,
    "Wager config not found",
    HttpStatus.NOT_FOUND
  );
  static readonly QUIZ_CONFIG_REQUIRE_AT_LEAST_VALUES = new CoreError(
    1017,
    "Wager config requires one of values in {1}",
    HttpStatus.NOT_FOUND
  );

  static readonly USER_SESSION_NOT_IN_ROOM = new CoreError(
    1017,
    "The current session not in room",
    HttpStatus.UNAUTHORIZED
  );

  static readonly QUIZ_NOT_FOUND = new CoreError(
    1018,
    "PvP battle not found",
    HttpStatus.NOT_FOUND
  );
  static readonly QUIZ_OPPONENT_LIMIT_EXCEEDED = new CoreError(
    1019,
    "Maximum number of matches {1} per {2} with this opponent have been reached",
    HttpStatus.BAD_REQUEST
  );
  static readonly AUTH_X_API_KEY_NOT_FOUND = new CoreError(
    40000,
    "Auth x-api-key not found",
    HttpStatus.UNAUTHORIZED
  );

  static readonly AUTH_X_API_KEY_INCORRECT = new CoreError(
    40001,
    "Auth x-api-key incorrect",
    HttpStatus.BAD_REQUEST
  );

  static readonly AUTH_X_USER_API_KEY_NOT_FOUND = new CoreError(
    40002,
    "Auth x-api-user-key not found",
    HttpStatus.UNAUTHORIZED
  );

  static readonly AUTH_X_STARK_KEY_NOT_FOUND = new CoreError(
    40003,
    "Auth x-stark-key not found",
    HttpStatus.UNAUTHORIZED
  );

  static readonly AUTH_SESSION_EXISTED = new CoreError(
    40004,
    "User session for this game already existed",
    HttpStatus.CONFLICT
  );

  static readonly AUTH_REQUEST_FORBIDDEN = new CoreError(
    40005,
    "User did not allow to perform this request",
    HttpStatus.FORBIDDEN
  );

  // Generic error typeORM: 5xxx
  static readonly TYPE_ORM_QUERY_FAILED = new CoreError(
    5000,
    "Query with error: {1}",
    HttpStatus.BAD_REQUEST
  );
  static readonly USER_NONCE_UNABLE_TO_GET = new CoreError(
    80015,
    `Unable to get user {1} nonce`,
    HttpStatus.NOT_FOUND
  );

  static readonly USER_INVALID_SIGNATURE = new CoreError(
    8002,
    "User requests invalid signature",
    HttpStatus.UNAUTHORIZED
  );

  static readonly USER_EXPIRED_SIGNATURE = new CoreError(
    8003,
    "User requests expired signature",
    HttpStatus.UNAUTHORIZED
  );

  static readonly CORE_API_MULTI_TRANSFER = new CoreError(
    90000,
    `Unable to request multi transfer`,
    HttpStatus.BAD_REQUEST
  );

  static readonly CORE_API_USER_NOT_FOUND_STARK_KEY = new CoreError(
    90001,
    `Unable to find user by starkKey {1}`,
    HttpStatus.BAD_REQUEST
  );
  static readonly CORE_API_USER_NOT_FOUND_ETH_ADDRESS = new CoreError(
    90002,
    `Unable to find user by wallet address  {1}`,
    HttpStatus.BAD_REQUEST
  );
  static readonly USER_NOT_FOUND = new CoreError(
    90003,
    `You must create a user first`,
    HttpStatus.BAD_REQUEST
  );
  private constructor(
    public readonly code: number,
    public readonly message: string,
    public readonly status: HttpStatus
  ) {}
}
