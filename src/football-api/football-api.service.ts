import { ConflictException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { CompetitionRepository } from '../competition/competition.repository';
import { Competition, CompetitionModel } from '../competition/entity/competition.model';
import { Player } from '../player/entity/player.model';
import { PlayerRepository } from '../player/player.repository';
import { Coach, Team, TeamModel } from '../team/entity/team.model';
import { TeamRepository } from '../team/team.repository';
import { CoachRepository } from '../player/coach.repository';

@Injectable()
export class FootballApiService {
    constructor(
        private readonly competitionRepository: CompetitionRepository,
        private readonly teamRepository: TeamRepository,
        private readonly playerRepository: PlayerRepository,
        private readonly coachRepository: CoachRepository,
        ) {}
    
    private apiUrl = process.env.API_URL || 'http://api.football-data.org/v4';
    private apiKey = process.env.API_TOKEN || 'your_default_api_token';
    private callsMade = 0;
    private readonly maxCallsPerMinute = 10;
    private readonly minuteInMillis = 60 * 1000;
    private lastCallTimestamp = Date.now();


    private async makeRequest(endpoint: string) {
      await this.waitIfNeeded();
        try {
            const response = await axios.get(`${this.apiUrl}${endpoint}`, {
                headers: {
                    'X-Auth-Token': this.apiKey,
                },
            });
            this.callsMade++;
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching data: ${error.message}`);
        }
    }

    private async waitIfNeeded(): Promise<void> {
      if (this.callsMade >= this.maxCallsPerMinute) {
          const timeElapsed = Date.now() - this.lastCallTimestamp;
          if (timeElapsed < this.minuteInMillis) {
              const delay = this.minuteInMillis - timeElapsed;
              await new Promise(resolve => setTimeout(resolve, delay));
              this.callsMade = 0;
          } else {
              this.callsMade = 0;
          }
      }
      this.lastCallTimestamp = Date.now();
  }

    async getTeams(competitionCode: string, competition: Competition):Promise<Team[]> {
      let teamsSaved: Team[] = []; // Initialize as an array

        try {
            const {teams} = await this.makeRequest(`/competitions/${competitionCode}/teams`);
            
            if (teams && Array.isArray(teams)) {
                // Use Promise.all to parallelize team creation
                await Promise.all(teams.map(async (team: any) => teamsSaved.push(await this.saveTeam(team, competition))));
            }
        
            // If needed, return the list of teams or any other meaningful result
            //return teams.map((team: any) => /* transform to TeamModel if needed */);
            return teamsSaved;
          } catch (error) {
            // Handle errors appropriately
            console.error('Error fetching or saving teams:', error);
            throw new ConflictException('Failed to fetch or save teams');
            
          }
        
    }

    async saveTeam(team: any, competition: Competition): Promise<Team> {
      try {
        // Check if the team already exists
        const existingTeam = await this.teamRepository.findOneByApiId(team.id);
    
        if (existingTeam) {
          // If the team exists, update the competitions property
          existingTeam.competitions.push(competition._id);
          await this.teamRepository.updateOneById(existingTeam._id.toString(), { competitions: existingTeam.competitions });
    
          return existingTeam;
        } else {
          // If the team doesn't exist, create a new one
          const newTeam = new Team({
            idApi: team.id,
            name: team.name,
            tla: team.tla,
            shortName: team.shortName,
            areaName: team.area.name,
            address: team.address,
            competitions: [competition._id],
          });
    
          await this.teamRepository.create(newTeam);
          return newTeam;
        }
      } catch (error) {
        // Handle errors appropriately
        console.error('Error saving team:', error);
        throw new ConflictException('Failed to save team');
      }
    }
      
    async getCompetition(leagueCode: string): Promise<Competition> {
      const data = await this.makeRequest(`/competitions/${leagueCode}`);
      const competitionData: Competition = new Competition({
        name: data.name,
        code: data.code,
        areaCode: data.area.code,
      });
      await this.competitionRepository.create(competitionData);
      return competitionData;
    }

    async getPlayers(teams: Team[]): Promise<void> {
        await Promise.all(
            teams.map(async (team) => {
              try {
                const singleTeam = await this.makeRequest(`/teams/${team.idApi}`);
                await this.savePlayers(team, singleTeam);
              } catch (error) {
              }
            })
          );
    }
    private async savePlayers(teamSaved: Team, teamApi: any): Promise<void> {
      if (teamApi.squad.length === 0) {
        // Only save coach
        const {coach} = teamApi;
        const competitionData: Coach = new Coach({
          name: coach.name,
          dateOfBirth: coach.dateOfBirth,
          nationality: coach.nationality,
          teams:[teamSaved._id]
        });
        await this.coachRepository.create(competitionData);
      } else {
        await Promise.all(
          teamApi.squad.map(async (player) => {
            // Check if the player already exists
            const existingPlayer = await this.playerRepository.findOneByApiId(player.id);
    
            if (existingPlayer) {
              // If the player exists, update the teams property
              existingPlayer.teams.push(teamSaved._id);
              await this.playerRepository.updateOneById(existingPlayer._id.toString(), { teams: existingPlayer.teams });
            } else {
              // If the player doesn't exist, create a new one
              await this.playerRepository.create(player, teamSaved._id);
            }
          })
        );
      }
    }
}
