import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamModel } from './entity/team.model';


@Injectable()
export class TeamRepository {
  
  constructor(
    @InjectModel(Team.name)
    private model: Model<TeamModel>
  ) {}

  async create(teamData: Partial<Team>): Promise<TeamModel> {
    const createdCompetition = new this.model(teamData);
    return createdCompetition.save();
  }

  async findAll(): Promise<TeamModel[]> {
    return this.model.find().exec();
  }

  async findOneById(id: string): Promise<TeamModel | null> {
    return this.model.findById(id).exec();
  }

  async updateOneById(id: string, teamData: Partial<Team>): Promise<TeamModel | null> {
    return this.model.findByIdAndUpdate(id, teamData, { new: true }).exec();
  }

  async deleteOneById(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
