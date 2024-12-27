import { Injectable } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Injectable()
@Schema()
export class Quiz extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({
    required: false,
    type: [
      {
        userId: { type: Types.ObjectId, ref: "User" },
      },
    ],
  })
  participants: {
    userId: Types.ObjectId;
  }[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
