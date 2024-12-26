import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { WsRedisDispatcherService } from "../modules/ws/ws-redis-dispatcher.service";
import { WebSocketRedisIOAdapter } from "../modules/ws/ws-redis-io.adapter";
import { WsStateService } from "../modules/ws/ws-state.service";
import { ConfigService } from "./services/config/config.service";
import { RedisService } from "./services/redis/redis.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "modules/user/user.schema";
import { UserRepository } from "modules/user/user.repository";
import { QuizRepository } from "modules/quiz/quiz.repository";
import { QuestionRepository } from "modules/question/question.repository";
import { ScoreRepository } from "modules/score/score.repository";
import { Quiz, QuizSchema } from "modules/quiz/quiz.schema";
import { Question, QuestionSchema } from "modules/question/question.schema";
import { Score, ScoreSchema } from "modules/score/score.schema";

const sharedServices = [HttpModule, ConfigService, RedisService];
const globalProviderRepositories = [
  UserRepository,
  QuizRepository,
  QuestionRepository,
  ScoreRepository,
];
const schemas = [
  { name: User.name, schema: UserSchema },
  { name: Quiz.name, schema: QuizSchema },
  { name: Question.name, schema: QuestionSchema },
  { name: Score.name, schema: ScoreSchema },
];
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".json"],
    }),
    ScheduleModule.forRoot(),
    HttpModule.register({}),
    MongooseModule.forFeature(schemas),
    MongooseModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.mongoUri,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [...sharedServices, ...globalProviderRepositories],
  providers: [...sharedServices, ...globalProviderRepositories],
})
export class SharedModule {
  constructor() {}
}

// Should be spit shared service to skip conflict initialized services
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".json"],
    }),
    HttpModule.register({}),
    MongooseModule.forFeature(schemas),
    MongooseModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.mongoUri,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [
    ...sharedServices,
    ...globalProviderRepositories,
    WsStateService,
    WebSocketRedisIOAdapter,
    WsRedisDispatcherService,
  ],
  providers: [
    ...sharedServices,
    ...globalProviderRepositories,
    WsStateService,
    WebSocketRedisIOAdapter,
    WsRedisDispatcherService,
  ],
})
export class SharedWsModule {
  constructor() {}
}
