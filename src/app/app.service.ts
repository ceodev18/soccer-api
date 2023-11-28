import { Injectable } from '@nestjs/common';
import { FootballApiService } from '../football-api/football-api.service';

@Injectable()
export class AppService {
  constructor(private readonly footballDataService: FootballApiService) {}

  health(): string {
    return 'App Module is working';
  }
  async importLeague(leagueCode: string): Promise<string> {
    const competition = await this.footballDataService.getCompetition(leagueCode);
    const teams = await this.footballDataService.getTeams(leagueCode,competition);
    await this.footballDataService.getPlayers(teams);
    return 'Importing League ' + leagueCode;
  }
}
