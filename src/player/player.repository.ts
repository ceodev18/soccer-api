// database/competition/competition.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Player, PlayerModel } from './entity/player.model';


@Injectable()
export class PlayerRepository {
  
  constructor(
    @InjectModel(Player.name)
    private model: Model<PlayerModel>
  ) {}

  async create(playerData: Partial<Player>, id: any): Promise<PlayerModel> {
    const { name} = playerData; // Extract relevant data
    let player: PlayerModel;
  
    // Check if the player with the given name already exists
    const existingPlayer = await this.model.findOne({ name }).exec();
  
    if (existingPlayer) {
      // If the player exists, add the new team ID to the teams array
      if (!existingPlayer.teams.includes(id)) {
        existingPlayer.teams.push(id); // Assuming there's only one team ID
        player = await existingPlayer.save();
      } else {
        // If the player already has the team ID or no team ID is provided, return the existing player
        player = existingPlayer;
      }
    } else {
      // If the player doesn't exist, create a new one
      const createdPlayer = new this.model({
        name: playerData.name,
        position: playerData.position,
        dateOfBirth: playerData.dateOfBirth,
        nationality: playerData.nationality,
        teams: [id],
      });
  
      player = await createdPlayer.save();
    }
  
    return player;
  }
  

  async findAll(): Promise<PlayerModel[]> {
    return this.model.find().exec();
  }

  async findOneById(id: string): Promise<PlayerModel | null> {
    return this.model.findById(id).exec();
  }

  async updateOneById(id: string, competitionData: Partial<Player>): Promise<PlayerModel | null> {
    return this.model.findByIdAndUpdate(id, competitionData, { new: true }).exec();
  }

  async deleteOneById(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
  
  async findOneByApiId(apiId: number): Promise<PlayerModel | null> {
    return this.model.findOne({ idApi: apiId }).exec();
  }
  async findByTeam(teamId: mongoose.Types.ObjectId): Promise<PlayerModel[]> {
    return this.model.find({ teams: teamId }).exec();
  }
  async exists(conditions: Record<string, any>): Promise<boolean> {
    const player = await this.model.findOne(conditions).exec();
    return !!player;
  }
}
