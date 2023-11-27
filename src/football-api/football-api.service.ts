import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CompetitionRepository } from 'src/competition/competition.repository';
import { Competition, CompetitionModel } from 'src/competition/entity/competition.model';
import { Player } from 'src/player/entity/player.model';
import { PlayerRepository } from 'src/player/player.repository';
import { Team, TeamModel } from 'src/team/entity/team.model';
import { TeamRepository } from 'src/team/team.repository';

@Injectable()
export class FootballApiService {
    constructor(
        private readonly competitionRepository: CompetitionRepository,
        private readonly teamRepository: TeamRepository,
        private readonly playerRepository: PlayerRepository,
        ) {}
    
    private apiUrl = process.env.API_URL || 'http://api.football-data.org/v4';
    private apiKey = process.env.API_TOKEN || 'your_default_api_token';

    private async makeRequest(endpoint: string) {
        try {
            const response = await axios.get(`${this.apiUrl}${endpoint}`, {
                headers: {
                    'X-Auth-Token': this.apiKey,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching data: ${error.message}`);
        }
    }

    async getTeams(competitionCode: string, competition: Competition):Promise< TeamModel[]> {
        const listOfTeams = this.makeRequest(`/competitions/${competitionCode}/teams`);
        
        try {
            console.log(listOfTeams);
            console.log(competition);
            // if (listOfTeams.teams && Array.isArray(listOfTeams.teams)) {
            //     const teams = listOfTeams.teams;
          
            //     // Iterate through the teams and save them
            //     for (const team of teams) {
            //       await this.saveTeam(team, competition);
            //     }
            //   }
        } catch (error) {
            
        }
        return null;
        
    }

    private async saveTeam(team: any, competition: Competition) {
        const newTeam = new Team({
            name: team.name,
            tla: team.tla,
            shortName: team.shortName,
            areaName: team.areaName,
            address: team.address,
            competitions: [competition._id],
        });
    
        await this.teamRepository.create(newTeam);
      }
      
    async getCompetition(leagueCode: string) {
      const data = await this.makeRequest(`/competitions/${leagueCode}`);
      const competitionData: Competition = new Competition({
        name: data.name,
        code: data.code,
        areaCode: data.area.code,
      });
      
      return this.competitionRepository.create(competitionData);
    }

    async getPlayers(teams: Team[]): Promise<void> {
        await Promise.all(
            teams.map(async (team) => {
              try {
                const singleTeam = await this.makeRequest(`/teams/${team._id}`);
                await this.savePlayers(singleTeam);
              } catch (error) {
              }
            })
          );
    }
    private async savePlayers(team: any):Promise<void> {
        if(team.squad.length == 0){
            //only save coach
        }else{
            await Promise.all(
                team.squad.map(async (player) => {
                    await this.playerRepository.create(player, team.id);
                })
            );
            
        }
      }
}
