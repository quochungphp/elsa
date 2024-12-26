import { Injectable } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Quiz } from "modules/quiz/quiz.schema";
import { User } from "modules/user/user.schema";
import mongoose, { Document } from "mongoose";

@Injectable()
@Schema()
export class Score extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Quiz" })
  quiz: Quiz;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
  user: User;

  @Prop({ default: 0 })
  score: Number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: null })
  endedAt: Date;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);
