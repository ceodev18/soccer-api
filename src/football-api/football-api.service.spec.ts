import { Test, TestingModule } from '@nestjs/testing';
import { FootballApiService } from './football-api.service';
import { CompetitionRepository } from '../competition/competition.repository';
import { TeamRepository } from '../team/team.repository';
import { PlayerRepository } from '../player/player.repository';
import { ConflictException } from '@nestjs/common';
import axios from 'axios';
import { Competition, CompetitionModel } from 'src/competition/entity/competition.model';
import { TeamModel } from 'src/team/entity/team.model';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { PlayerModel } from 'src/player/entity/player.model';
import { getModelToken } from '@nestjs/mongoose';
import { CoachRepository } from '../player/coach.repository';

jest.mock('axios');

describe('FootballApiService', () => {
  let footballApiService: FootballApiService;
  let competitionRepositoryMock: jest.Mocked<CompetitionRepository>;
  let teamRepositoryMock: jest.Mocked<TeamRepository>;
  let playerRepositoryMock: jest.Mocked<PlayerRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FootballApiService,
        {
          provide: CompetitionRepository,
          useFactory: () => ({
            findOneByApiId: jest.fn(),
            create: jest.fn(),
            updateOneById: jest.fn(),
          }),
        },
        {
          provide: TeamRepository,
          useFactory: () => ({
            findOneByApiId: jest.fn(),
            create: jest.fn(),
            updateOneById: jest.fn(),
          }),
        },
        {
          provide: PlayerRepository,
          useFactory: () => ({
            findOneByApiId: jest.fn(),
            create: jest.fn(),
            updateOneById: jest.fn(),
          }),
        },
        CompetitionRepository,
        TeamRepository,
        PlayerRepository,
        CoachRepository,
        {
          provide: getModelToken('Competition'), // Adjust the model name accordingly
          useValue: {}, // Mock the model
        },
        {
          provide: getModelToken('Team'), // Adjust the model name accordingly
          useValue: {}, // Mock the model
        },
        {
          provide: getModelToken('Player'), // Adjust the model name accordingly
          useValue: {}, // Mock the model
        },
        {
          provide: getModelToken('Coach'), // Adjust the model name accordingly
          useValue: {}, // Mock the model
        }
      ],
    }).compile();

    footballApiService = module.get<FootballApiService>(FootballApiService);
    competitionRepositoryMock = module.get(CompetitionRepository) as jest.Mocked<CompetitionRepository>;
    teamRepositoryMock = module.get(TeamRepository) as jest.Mocked<TeamRepository>;
    playerRepositoryMock = module.get(PlayerRepository) as jest.Mocked<PlayerRepository>;
  });

  describe('getTeams', () => {
    it('should fetch and save teams', async () => {
      const competitionCode = 'PL';
      const competition: Competition = {
        name: "Premier League",
        code: "PL",
        areaCode: "ENG",
      };
      const axiosMock = axios as jest.Mocked<typeof axios>;


      const teamsData = [
        { id: 1, name: 'Team A', tla: 'TA', shortName: 'A', area: { name: 'Area A' }, address: 'Team A Address' },
        // Add more teams as needed
      ];

      axiosMock.get.mockResolvedValue({ data: { teams: teamsData } });


      competitionRepositoryMock.create.mockResolvedValue((competition as unknown) as CompetitionModel);

      teamRepositoryMock.findOneByApiId.mockResolvedValue(null);
      teamRepositoryMock.create.mockImplementation((team) => {
        const mockTeamModel: TeamModel = {
          _id: new ObjectId(),
          idApi: 57,
          name: "Arsenal FC",
          areaName: "England",
          shortName: "Arsenal",
          tla: "ARS",
          address: "75 Drayton Park London N5 1BU",
          competitions: team.competitions,
        } as TeamModel;

        return Promise.resolve(mockTeamModel);
      });

      const result = await footballApiService.getTeams(competitionCode, competition);

      expect(result).toEqual([
        { idApi: 1, name: 'Team A', tla: 'TA', shortName: 'A', areaName: 'Area A', address: 'Team A Address', competitions: ['competition-id'] },
        // Add more teams as needed
      ]);

      expect(competitionRepositoryMock.create).toHaveBeenCalledWith(competition);
      expect(teamRepositoryMock.findOneByApiId).toHaveBeenCalledTimes(teamsData.length);
      expect(teamRepositoryMock.create).toHaveBeenCalledTimes(teamsData.length);
      expect(teamRepositoryMock.updateOneById).not.toHaveBeenCalled();
    });

    it('should handle errors when fetching teams', async () => {
      const competitionCode = 'your-competition-code';
      const competition: Competition = {
        name: "Premier League",
        code: "PL",
        areaCode: "ENG",
      };

      jest.spyOn(axios, 'get').mockRejectedValue(new Error('Failed to fetch teams'));

      competitionRepositoryMock.create.mockResolvedValue((competition as unknown) as CompetitionModel);

      await expect(footballApiService.getTeams(competitionCode, competition)).rejects.toThrowError(ConflictException);
      expect(competitionRepositoryMock.create).toHaveBeenCalledWith(competition);
      expect(teamRepositoryMock.findOneByApiId).not.toHaveBeenCalled();
      expect(teamRepositoryMock.create).not.toHaveBeenCalled();
      expect(teamRepositoryMock.updateOneById).not.toHaveBeenCalled();
    });
  });

  describe('saveTeam', () => {
    it('should create a new team', async () => {
      const teamData: TeamModel = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Team A',
        tla: 'TA',
        shortName: 'A',
        areaName: 'Area A',
        address: 'Team A Address',
      } as TeamModel;

      const competition: Competition = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Competition Name',
        code: 'COMP',
        areaCode: 'AREA',
      };

      teamRepositoryMock.findOneByApiId.mockResolvedValue(null);
      teamRepositoryMock.create.mockImplementation((team) => Promise.resolve(teamData));

      const result = await footballApiService.saveTeam(teamData, competition);

      expect(result).toEqual({
        idApi: 1,
        name: 'Team A',
        tla: 'TA',
        shortName: 'A',
        areaName: 'Area A',
        address: 'Team A Address',
        competitions: ['competition-id'],
      });

      expect(teamRepositoryMock.findOneByApiId).toHaveBeenCalledWith(1);
      expect(teamRepositoryMock.create).toHaveBeenCalledWith({
        idApi: 1,
        name: 'Team A',
        tla: 'TA',
        shortName: 'A',
        areaName: 'Area A',
        address: 'Team A Address',
        competitions: ['competition-id'],
      });
      expect(teamRepositoryMock.updateOneById).not.toHaveBeenCalled();
    });

    it('should update an existing team', async () => {
      const teamData: TeamModel = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Team A',
        tla: 'TA',
        shortName: 'A',
        areaName: 'Area A',
        address: 'Team A Address',
      } as TeamModel;

      const existingTeam: TeamModel = {
        _id: new mongoose.Types.ObjectId(),
        idApi: 1,
        name: 'Team A',
        tla: 'TA',
        shortName: 'A',
        areaName: 'Area A',
        address: 'Team A Address',
        competitions: [teamData._id],
      } as TeamModel;

      const competition: CompetitionModel = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Competition Name',
        code: 'COMP',
        areaCode: 'AREA',
      } as CompetitionModel;

      teamRepositoryMock.findOneByApiId.mockResolvedValue(existingTeam);
      teamRepositoryMock.updateOneById.mockResolvedValue(existingTeam);

      const result = await footballApiService.saveTeam(teamData, competition);

      expect(result).toEqual({
        _id: 'team-id',
        idApi: 1,
        name: 'Team A',
        tla: 'TA',
        shortName: 'A',
        areaName: 'Area A',
        address: 'Team A Address',
        competitions: ['competition-id', 'competition-id'],
      });

      expect(teamRepositoryMock.findOneByApiId).toHaveBeenCalledWith(1);
      expect(teamRepositoryMock.create).not.toHaveBeenCalled();
      expect(teamRepositoryMock.updateOneById).toHaveBeenCalledWith('team-id', {
        competitions: ['competition-id', 'competition-id'],
      });
    });

    it('should handle errors when saving a team', async () => {
      const teamData = {
        id: 1,
        name: 'Team A',
        tla: 'TA',
        shortName: 'A',
        area: { name: 'Area A' },
        address: 'Team A Address',
      };

      const competition: Competition= {
        _id: new mongoose.Types.ObjectId(),
        name: 'Competition Name',
        code: 'COMP',
        areaCode: 'AREA',
      }as Competition;

      teamRepositoryMock.findOneByApiId.mockRejectedValue(new Error('Failed to fetch team'));
      teamRepositoryMock.create.mockResolvedValue(undefined);

      await expect(footballApiService.saveTeam(teamData, competition)).rejects.toThrowError(ConflictException);

      expect(teamRepositoryMock.findOneByApiId).toHaveBeenCalledWith(1);
      expect(teamRepositoryMock.create).not.toHaveBeenCalled();
      expect(teamRepositoryMock.updateOneById).not.toHaveBeenCalled();
    });
  });

  describe('getCompetition', () => {
    it('should fetch and create a competition', async () => {
      const leagueCode = 'PL';

      const competitionData:CompetitionModel = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Competition Name',
        code: 'COMP',
        areaCode:'AREA' ,
      }as CompetitionModel;

      
      jest.spyOn(axios, 'get').mockResolvedValue(competitionData);

      competitionRepositoryMock.create.mockResolvedValue(competitionData);

      const result = await footballApiService.getCompetition(leagueCode);

      expect(result).toEqual(competitionData);
      expect(competitionRepositoryMock.create).toHaveBeenCalledWith(competitionData);
    });

    it('should handle errors when fetching a competition', async () => {
      const leagueCode = 'your-league-code';

      jest.spyOn(axios, 'get').mockRejectedValue(new Error('Failed to fetch competition'));

      competitionRepositoryMock.create.mockResolvedValue(undefined);

      await expect(footballApiService.getCompetition(leagueCode)).rejects.toThrowError(ConflictException);

      expect(competitionRepositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('getPlayers', () => {
    it('should fetch and save players', async () => {

      const competition: CompetitionModel = {
        _id: new mongoose.Types.ObjectId(),
        name: "Premier League",
        code: "PL",
        areaCode: "ENG",
      } as CompetitionModel;

      const teamData: TeamModel = {
        _id: new mongoose.Types.ObjectId(),
        name: "Arsenal FC",
        areaName: "England",
        shortName: "Arsenal",
        tla: "ARS",
        address: "75 Drayton Park London N5 1BU",
        competitions: [competition._id],
        // other properties
      } as TeamModel;
  

      const existingPlayer: PlayerModel = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Player A',
        position: "Midfield",
        dateOfBirth: "2001-03-13",
        nationality: "England",
        teams: [teamData._id],
      } as PlayerModel;

      jest.spyOn(axios, 'get').mockResolvedValue(teamData);

      teamRepositoryMock.findOneByApiId.mockResolvedValue(teamData);
      playerRepositoryMock.findOneByApiId.mockResolvedValue(existingPlayer);
      playerRepositoryMock.updateOneById.mockResolvedValue(existingPlayer);
      playerRepositoryMock.create.mockResolvedValue(undefined);

      await footballApiService.getPlayers([/* team data */]);

      expect(teamRepositoryMock.findOneByApiId).toHaveBeenCalledWith(1);
      expect(playerRepositoryMock.findOneByApiId).toHaveBeenCalledWith(1);
      expect(playerRepositoryMock.create).not.toHaveBeenCalled();
      expect(playerRepositoryMock.updateOneById).toHaveBeenCalledWith('player-id', { teams: ['team-id', 1] });
    });

    it('should handle errors when fetching players', async () => {
      const competition: CompetitionModel = {
        _id: new mongoose.Types.ObjectId(),
        name: "Premier League",
        code: "PL",
        areaCode: "ENG",
      } as CompetitionModel;

      const teamData: TeamModel = {
        _id: new mongoose.Types.ObjectId(),
        name: "Arsenal FC",
        areaName: "England",
        shortName: "Arsenal",
        tla: "ARS",
        address: "75 Drayton Park London N5 1BU",
        competitions: [competition._id],
        // other properties
      } as TeamModel;

      
      jest.spyOn(axios, 'get').mockRejectedValue(new Error('Failed to fetch players'));

      teamRepositoryMock.findOneByApiId.mockResolvedValue(teamData);
      playerRepositoryMock.findOneByApiId.mockResolvedValue(undefined);
      playerRepositoryMock.create.mockResolvedValue(undefined);

      await expect(footballApiService.getPlayers([/* team data */])).rejects.toThrowError(ConflictException);

      expect(teamRepositoryMock.findOneByApiId).toHaveBeenCalledWith(1);
      expect(playerRepositoryMock.findOneByApiId).not.toHaveBeenCalled();
      expect(playerRepositoryMock.create).not.toHaveBeenCalled();
      expect(playerRepositoryMock.updateOneById).not.toHaveBeenCalled();
    });

    it('should handle errors when saving players', async () => {
      const competition: CompetitionModel = {
        _id: new mongoose.Types.ObjectId(),
        name: "Premier League",
        code: "PL",
        areaCode: "ENG",
      } as CompetitionModel;
      
      const team: TeamModel = {
        _id: new mongoose.Types.ObjectId(),
        name: "Arsenal FC",
        areaName: "England",
        shortName: "Arsenal",
        tla: "ARS",
        address: "75 Drayton Park London N5 1BU",
        competitions: [competition._id],
        // other properties
      } as TeamModel;
      const teamData = {
        idApi: 1,
        squad: [
          { id: 1, name: 'Player A', /* other player data */ },
          // Add more players as needed
        ],
      };

      const existingPlayer: PlayerModel = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Player A',
        position: "Midfield",
        dateOfBirth: "2001-03-13",
        nationality: "England",
        teams: [team._id],
      } as PlayerModel;

      
      jest.spyOn(axios, 'get').mockResolvedValue(teamData);

      teamRepositoryMock.findOneByApiId.mockResolvedValue(team);
      playerRepositoryMock.findOneByApiId.mockResolvedValue(existingPlayer);
      playerRepositoryMock.updateOneById.mockRejectedValue(new Error('Failed to update player'));

      await expect(footballApiService.getPlayers([/* team data */])).rejects.toThrowError(ConflictException);

      expect(teamRepositoryMock.findOneByApiId).toHaveBeenCalledWith(1);
      expect(playerRepositoryMock.findOneByApiId).toHaveBeenCalledWith(1);
      expect(playerRepositoryMock.create).not.toHaveBeenCalled();
      expect(playerRepositoryMock.updateOneById).toHaveBeenCalledWith('player-id', { teams: ['team-id', 1] });
    });
  });
});
