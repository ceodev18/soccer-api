import { Injectable } from '@nestjs/common';
import { Team, TeamModel } from './entity/team.model';
import { PlayerService } from '../player/player.service';
import { CoachModel } from './entity/team.model';
import { TeamRepository } from './team.repository';
import { PlayerRepository } from '../player/player.repository';
import { CoachRepository } from '../player/coach.repository';
import { PlayerModel } from '../player/entity/player.model';
@Injectable()
export class TeamService {
    constructor(
        private readonly teamRepository: TeamRepository,
        private readonly playerRepository: PlayerRepository,
        private readonly coachRepository: CoachRepository) { }

    async getTeamByName(name: string): Promise<any> {
        // Your logic to fetch the team by name (replace the following line with your actual implementation)
        const team: TeamModel = await this.teamRepository.findTeamByName(name);
        console.log(team);
        // If the team is found and player inclusion is requested
        if (team) {
            let response: any = {team};
            try {
                // Resolve players or coaches based on availability
                const playersOrCoaches = await this.getPlayersForTeam(team);

                if (Array.isArray(playersOrCoaches)) {
                    response.players = playersOrCoaches;
                } else {
                    response.coach = playersOrCoaches;
                }

                return response;

            } catch (error) {
                console.error('Error resolving players or coaches:', error.message);
            }
        }

        throw new Error('Team not found');
    }
    async getPlayersForTeam(team: Team): Promise<PlayerModel[] | CoachModel> {
        try {
            // If the team has players, fetch and return players
            const hasPlayers = await this.playerRepository.findByTeam(team._id);
            if(hasPlayers && hasPlayers.length>0){
                return hasPlayers;
            }else{
                return this.coachRepository.findByTeam(team._id);
            }
        } catch (error) {
            console.error('Error fetching players or coaches for team:', error.message);
            throw new Error('Failed to fetch players or coaches for team');
        }
    }

}
