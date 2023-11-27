import { Module } from '@nestjs/common';
import { FootballApiService } from './football-api.service';
import { CompetitionModule } from 'src/competition/competition.module';
import { TeamModule } from 'src/team/team.module';
import { PlayerModule } from 'src/player/player.module';
import { CompetitionRepository } from 'src/competition/competition.repository';

@Module({
    imports:[CompetitionModule, TeamModule, PlayerModule],
    providers: [FootballApiService, CompetitionModule, TeamModule, PlayerModule]
  })
export class FootballApiModule {}
