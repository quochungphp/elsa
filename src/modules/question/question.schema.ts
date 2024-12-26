import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: { createdAt: "createdAt", updatedAt: false } })
export class Question extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: "Quiz" })
  quizId: Types.ObjectId;

  @Prop({ required: true })
  questionText: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctAnswer: number;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
