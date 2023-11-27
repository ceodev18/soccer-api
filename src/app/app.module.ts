import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamModule } from '../team/team.module';
import { CompetitionModule } from '../competition/competition.module';
import { PlayerModule } from '../player/player.module';
import { FootballApiModule } from 'src/football-api/football-api.module';
import { FootballApiService } from 'src/football-api/football-api.service';

@Module({
  imports: [TeamModule, CompetitionModule, PlayerModule, FootballApiModule],
  controllers: [AppController],
  providers: [AppService, FootballApiService],
})
export class AppModule {}
