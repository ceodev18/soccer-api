import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { CompetitionRepository } from '../competition/competition.repository';
import { TeamRepository } from '../team/team.repository';
import { CoachRepository } from './coach.repository';
import { PlayerRepository } from './player.repository';
import { Player, PlayerModel } from './entity/player.model';
import { CoachModel, Team, TeamModel } from 'src/team/entity/team.model';
import { Competition, CompetitionModel } from 'src/competition/entity/competition.model';
import mongoose from 'mongoose';

describe('PlayerService', () => {
  let playerService: PlayerService;
  let competitionRepositoryMock: jest.Mocked<CompetitionRepository>;
  let teamRepositoryMock: jest.Mocked<TeamRepository>;
  let playerRepositoryMock: jest.Mocked<PlayerRepository>;
  let coachRepositoryMock: jest.Mocked<CoachRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: CompetitionRepository,
          useFactory: () => ({ findOneByCode: jest.fn() }),
        },
        {
          provide: TeamRepository,
          useFactory: () => ({ findByCompetition: jest.fn() }),
        },
        {
          provide: PlayerRepository,
          useFactory: () => ({ findByTeam: jest.fn() }),
        },
        {
          provide: CoachRepository,
          useFactory: () => ({ findByTeam: jest.fn() }),
        },
      ],
    }).compile();

    playerService = module.get<PlayerService>(PlayerService);
    competitionRepositoryMock = module.get(CompetitionRepository);
    teamRepositoryMock = module.get(TeamRepository);
    playerRepositoryMock = module.get(PlayerRepository);
    coachRepositoryMock = module.get(CoachRepository);
  });

  describe('getPlayers', () => {
    const leagueCode = 'PL';

    const teamName = 'Arsenal FC';

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

    const coach: CoachModel = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Coach1',
      nationality: 'Germany',
      teams: [team._id],
    } as CoachModel;

    const teams: TeamModel[] = [
      {
        _id: new mongoose.Types.ObjectId(),
        idApi: 57,
        name: "Arsenal FC",
        areaName: "England",
        shortName: "Arsenal",
        tla: "ARS",
        address: "75 Drayton Park London N5 1BU",
        competitions: [competition._id]
      } as TeamModel,
      {
        _id: new mongoose.Types.ObjectId(),
        idApi: 58,
        name: "Aston Villa FC",
        areaName: "England",
        shortName: "Aston Villa",
        tla: "AVL",
        address: "Villa Park Birmingham B6 6HE",
        competitions: [competition._id]
      } as TeamModel,
      // Add more teams as needed
    ];
    const players: PlayerModel[] =
      [
        {
          _id: new mongoose.Types.ObjectId(),
          "name": "Vitalii Mykolenko",
          "position": "Defence",
          "dateOfBirth": "1999-05-29",
          "nationality": "Ukraine",
          "teams": [
            team._id
          ],
        } as PlayerModel,
        {
          _id: new mongoose.Types.ObjectId(),
          "name": "Nathan Patterson",
          "position": "Defence",
          "dateOfBirth": "2001-10-16",
          "nationality": "Scotland",
          "teams": [
            team._id
          ],
        } as PlayerModel
    ]

    it('should return players if available', async () => {

      competitionRepositoryMock.findOneByCode.mockResolvedValue(competition);
      teamRepositoryMock.findByCompetition.mockResolvedValue(teams);
      playerRepositoryMock.findByTeam.mockResolvedValue(undefined);

      const result = await playerService.getPlayers(leagueCode);

      expect(result).toEqual(players);
    });

    it('should return coaches if no players available', async () => {

      const leagueCode = 'PL';
      const competition: CompetitionModel = {
        _id: new mongoose.Types.ObjectId(),
        name: "Premier League",
        code: "AM",
        areaCode: "ENG",
      } as CompetitionModel;

      const teams: TeamModel[] = [
        {
          _id: new mongoose.Types.ObjectId(),
          idApi: 57,
          name: "Arsenal FCX",
          areaName: "England",
          shortName: "Arsenal",
          tla: "ARS",
          address: "75 Drayton Park London N5 1BU",
          competitions: [competition._id]
        } as TeamModel,
        {
          _id: new mongoose.Types.ObjectId(),
          idApi: 58,
          name: "Aston Villa FCX",
          areaName: "England",
          shortName: "Aston Villa",
          tla: "AVL",
          address: "Villa Park Birmingham B6 6HE",
          competitions: [competition._id]
        } as TeamModel,
        // Add more teams as needed
      ];

      const mockPlayersOrCoaches: PlayerModel[] = [
        {
          "_id": new mongoose.Types.ObjectId(),
          "name": "James Garner",
          "position": "Midfield",
          "dateOfBirth": "2001-03-13",
          "nationality": "England",
          "teams": [
            competition._id
          ]
        } as PlayerModel,
      ];

      const coach: CoachModel = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Coach1',
        nationality: 'Germany',
        teams: [team._id],
      }as CoachModel;

      competitionRepositoryMock.findOneByCode.mockResolvedValue(competition);
      teamRepositoryMock.findByCompetition.mockResolvedValue(teams);
      playerRepositoryMock.findByTeam.mockResolvedValue([]);
      coachRepositoryMock.findByTeam.mockResolvedValue(undefined);

      const result = await playerService.getPlayers(leagueCode);

      expect(result).toEqual(coach);
    });

    it('should throw an error if competition not found', async () => {
      const leagueCode = 'PL';

      competitionRepositoryMock.findOneByCode.mockResolvedValue(undefined);

      await expect(playerService.getPlayers(leagueCode)).rejects.toThrow('Failed to fetch players or coaches');
    });

  });
});
