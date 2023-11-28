import { Injectable } from '@nestjs/common';
import { Player, PlayerModel } from './entity/player.model';
import { CompetitionRepository } from '../competition/competition.repository';
import { TeamRepository } from '../team/team.repository';
import { CoachRepository } from './coach.repository';
import { PlayerRepository } from './player.repository';
import { CoachModel } from '../team/entity/team.model';

@Injectable()
export class PlayerService {
    constructor(
        private readonly competitionRepository: CompetitionRepository,
        private readonly teamRepository: TeamRepository,
        private readonly playerRepository: PlayerRepository,
        private readonly coachRepository: CoachRepository,
    ) { }

    async getPlayers(leagueCode: string): Promise<PlayerModel[] | CoachModel[]> {
        try {
            // Check if the competition with the given leagueCode exists
            const competition = await this.competitionRepository.findOneByCode(leagueCode);

            if (!competition) {
                throw new Error('Competition not found');
            }

            // Find all teams participating in the competition
            const teams = await this.teamRepository.findByCompetition(competition._id);

            // If no teams are found, respond with an error or handle it accordingly
            if (teams.length === 0) {
                throw new Error('No teams found for the given competition');
            }

            // Get players for each team
            const playersPromises = teams.map(async (team) => {
                return this.playerRepository.findByTeam(team._id);
            });

            // Wait for all promises to resolve and flatten the array of arrays
            const playersArray: PlayerModel[] = (await Promise.all(playersPromises)).flat();

            // Fetch coaches for all teams
            const coachesPromises = teams.map(async (team) => {
                return this.coachRepository.findByTeam(team._id);
            });

            // Wait for all promises to resolve and flatten the array of arrays
            const coachesArray: CoachModel[] = (await Promise.all(coachesPromises)).flat();

            console.log(playersArray);

            // Return a combination of players and coaches
            return playersArray.length > 0 ? playersArray : coachesArray;
        } catch (error) {
            console.error('Error fetching players or coaches:', error.message);
            throw new Error('Failed to fetch players or coaches');
        }
    }
}

