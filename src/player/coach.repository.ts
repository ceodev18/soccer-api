// database/competition/competition.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Coach, CoachModel } from '../team/entity/team.model';


@Injectable()
export class CoachRepository {
  
  constructor(
    @InjectModel(Coach.name)
    private model: Model<CoachModel>
  ) {}

  async create(coachData: Partial<Coach>): Promise<CoachModel> {
    const createdCoach= new this.model(coachData);
    return createdCoach.save();
  }
  

  async findAll(): Promise<CoachModel[]> {
    return this.model.find().exec();
  }

  async findOneById(id: string): Promise<CoachModel | null> {
    return this.model.findById(id).exec();
  }

  async updateOneById(id: string, coachData: Partial<Coach>): Promise<CoachModel | null> {
    return this.model.findByIdAndUpdate(id, coachData, { new: true }).exec();
  }

  async deleteOneById(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
  async findByTeam(teamId: mongoose.Types.ObjectId): Promise<CoachModel | null> {
    return this.model.findOne({ teams: teamId }).exec();
  }
  
}
