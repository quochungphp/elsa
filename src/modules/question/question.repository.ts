import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { Question } from "./question.schema";

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectModel(Question.name) readonly QuestionModel: Model<Question>
  ) {}

  async create(data: Partial<Question>): Promise<Question> {
    const createdQuestion = new this.QuestionModel(data);
    return createdQuestion.save();
  }

  async findAll(): Promise<Question[]> {
    return this.QuestionModel.find().exec();
  }

  async findById(id: string): Promise<Question | null> {
    return this.QuestionModel.findById(id).exec();
  }
  async findAllById(quizId: string): Promise<Question[]> {
    return this.QuestionModel.find({ quizId }).exec();
  }
  async update(id: string, data: Partial<Question>): Promise<Question | null> {
    return this.QuestionModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<Question | null> {
    return this.QuestionModel.findByIdAndDelete(id).exec();
  }
}
