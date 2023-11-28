import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { PlayerRepository } from './player.repository';
import { Player, PlayerSchema } from './entity/player.model';
import { TeamRepository } from 'src/team/team.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnection } from 'src/database/database.connection';
import { CoachRepository } from './coach.repository';
import { Coach, CoachSchema } from 'src/team/entity/team.model';
import { CompetitionModule } from 'src/competition/competition.module';
import { TeamModule } from 'src/team/team.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Coach.name, schema: CoachSchema }]),
    MongooseModule.forRootAsync({
      useClass: DatabaseConnection,
    }),
    CompetitionModule, 
    TeamModule, 
    PlayerModule,
  ],
  providers: [PlayerService, PlayerRepository, CoachRepository],
  controllers: [PlayerController],
  exports:[PlayerRepository, CoachRepository]
})
export class PlayerModule {}

