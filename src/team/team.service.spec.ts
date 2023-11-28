import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';
import { PlayerRepository } from '../player/player.repository';
import { CoachRepository } from '../player/coach.repository';
import { CoachModel, TeamModel } from './entity/team.model';
import { PlayerModel } from '../player/entity/player.model';
import { Competition } from '../competition/entity/competition.model';
import mongoose from 'mongoose';

jest.mock('./team.repository');
jest.mock('../player/player.repository');
jest.mock('../player/coach.repository');

describe('TeamService', () => {
  let teamService: TeamService;
  let teamRepositoryMock: jest.Mocked<TeamRepository>;
  let playerRepositoryMock: jest.Mocked<PlayerRepository>;
  let coachRepositoryMock: jest.Mocked<CoachRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        TeamRepository,
        PlayerRepository,
        CoachRepository,
      ],
    }).compile();

    teamService = module.get<TeamService>(TeamService);
    teamRepositoryMock = module.get(TeamRepository);
    playerRepositoryMock = module.get(PlayerRepository);
    coachRepositoryMock = module.get(CoachRepository);
  });

  describe('getTeamByName', () => {
    const teamName = 'Arsenal FC';
    const competition: Competition = {
      _id: new mongoose.Types.ObjectId(),
      name: "Premier League",
      code: "PL",
      areaCode: "ENG",
    };
    const team: TeamModel = {
      _id: new mongoose.Types.ObjectId(),
      name: "Arsenal FC",
      areaName: "England",
      shortName: "Arsenal",
      tla: "ARS",
      address: "75 Drayton Park London N5 1BU",
      competitions: [competition._id],
      // other properties
    }as TeamModel;

    const players: PlayerModel[] = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Player1',
        position: 'Midfield',
        dateOfBirth: '1995-01-01',
        nationality: 'England',
        teams: [team._id],
        // other properties
      } as PlayerModel,
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Player2',
        position: 'Forward',
        dateOfBirth: '1993-02-15',
        nationality: 'Spain',
        teams: [team._id],
        // other properties
      }as PlayerModel,
    ];
    const coach: CoachModel = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Coach1',
      nationality: 'Germany',
      teams: [team._id],
    }as CoachModel;


    it('should return team with players', async () => {
      
      teamRepositoryMock.findTeamByName.mockResolvedValue(team);
      playerRepositoryMock.findByTeam.mockResolvedValue(players);

      const result = await teamService.getTeamByName(teamName);

      expect(result).toEqual({
        team,
        players,
      });
    });

    it('should return team with coach', async () => {
      
      teamRepositoryMock.findTeamByName.mockResolvedValue(team);
      playerRepositoryMock.findByTeam.mockResolvedValue([]); // Empty players array
      coachRepositoryMock.findByTeam.mockResolvedValue(coach);

      const result = await teamService.getTeamByName(teamName);

      expect(result).toEqual({
        team,
        coach,
      });
    });

    it('should throw an error if team is not found', async () => {
      const teamName = 'NonExistentTeam';

      teamRepositoryMock.findTeamByName.mockResolvedValue(null);

      await expect(teamService.getTeamByName(teamName)).rejects.toThrowError('Team not found');
    });

    it('should throw an error if there is an error fetching players or coaches', async () => {
      teamRepositoryMock.findTeamByName.mockResolvedValue(team);
      playerRepositoryMock.findByTeam.mockRejectedValue(new Error('Failed to fetch players'));

      await expect(teamService.getTeamByName(teamName)).rejects.toThrowError('Team not found');
    });
  
  });
});
