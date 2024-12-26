import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Score } from "./score.schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ScoreRepository {
  constructor(@InjectModel(Score.name) readonly ScoreModel: Model<Score>) {}

  async create(data: Partial<Score>): Promise<Score> {
    const createdScore = new this.ScoreModel(data);
    return createdScore.save();
  }

  async findAll(): Promise<Score[]> {
    return this.ScoreModel.find().exec();
  }

  async findById(id: string): Promise<Score | null> {
    return this.ScoreModel.findById(id).exec();
  }

  async update(id: string, data: Partial<Score>): Promise<Score | null> {
    return this.ScoreModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<Score | null> {
    return this.ScoreModel.findByIdAndDelete(id).exec();
  }
}
