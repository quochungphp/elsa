import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { Quiz } from "./quiz.schema";

@Injectable()
export class QuizRepository {
  constructor(@InjectModel(Quiz.name) readonly QuizModel: Model<Quiz>) {}

  async create(data: Partial<Quiz>): Promise<Quiz> {
    const createdQuiz = new this.QuizModel(data);
    return createdQuiz.save();
  }

  async findAll(): Promise<Quiz[]> {
    return this.QuizModel.find().exec();
  }

  async findById(id: string): Promise<Quiz | null> {
    return this.QuizModel.findById(id).exec();
  }

  async update(id: string, data: Partial<Quiz>): Promise<Quiz | null> {
    return this.QuizModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<Quiz | null> {
    return this.QuizModel.findByIdAndDelete(id).exec();
  }
}
