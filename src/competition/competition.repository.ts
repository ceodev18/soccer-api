// database/competition/competition.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Competition, CompetitionModel } from './entity/competition.model';


@Injectable()
export class CompetitionRepository {
  
  constructor(
    @InjectModel(Competition.name)
    private model: Model<CompetitionModel>
  ) {}

  async create(competitionData: Partial<Competition>): Promise<CompetitionModel> {
    const existingCompetition = await this.model.findOne({ code: competitionData.code }).exec();

    if (existingCompetition) {
      // Handle validation error 
      console.log('Handle validation error ');
      throw new ConflictException('Competition with the same code already exists');
    }
    const createdCompetition = new this.model(competitionData);
    return createdCompetition.save();
  }

  async findAll(): Promise<CompetitionModel[]> {
    return this.model.find().exec();
  }

  async findOneById(id: string): Promise<CompetitionModel | null> {
    return this.model.findById(id).exec();
  }

  async updateOneById(id: string, competitionData: Partial<Competition>): Promise<CompetitionModel | null> {
    return this.model.findByIdAndUpdate(id, competitionData, { new: true }).exec();
  }

  async deleteOneById(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
  async findOneByCode(leagueCode: string): Promise<CompetitionModel | null> {
    return this.model.findOne({ code: leagueCode }).exec();
  }
}
