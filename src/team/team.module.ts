import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnection } from '../database/database.connection';
import { Coach, CoachSchema, Team, TeamSchema } from './entity/team.model';
import { CoachRepository } from '../player/coach.repository';
import { PlayerRepository } from '../player/player.repository';
import { Player, PlayerSchema } from '../player/entity/player.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: Coach.name, schema: CoachSchema },
      { name: Player.name, schema: PlayerSchema }
    ]),
    MongooseModule.forRootAsync({
      useClass: DatabaseConnection,
    }),
  ],
  providers: [TeamService, TeamRepository, CoachRepository, PlayerRepository],
  controllers: [TeamController],
  exports: [TeamRepository],
})
export class TeamModule {}
