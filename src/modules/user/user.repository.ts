import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) readonly UserModel: Model<User>) {}

  async create(data: Partial<User>): Promise<User> {
    const createdUser = new this.UserModel(data);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.UserModel.find().exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.UserModel.findById(id).exec();
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    return this.UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<User | null> {
    return this.UserModel.findByIdAndDelete(id).exec();
  }
}
