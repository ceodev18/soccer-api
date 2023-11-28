import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { CompetitionRepository } from '../competition/competition.repository';
import { TeamRepository } from '../team/team.repository';
import { CoachRepository } from './coach.repository';
import { PlayerRepository } from './player.repository';
import { Player, PlayerModel } from './entity/player.model';
import { CoachModel, Team, TeamModel } from 'src/team/entity/team.model';
import { Competition, CompetitionModel } from 'src/competition/entity/competition.model';
import { ObjectId } from 'mongodb';

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
    it('should return players if available', async () => {
      const leagueCode = 'PL';
      const competitionMock: CompetitionModel = {
        _id: new ObjectId(),
        name: "Premier League",
        code: "PL",
        areaCode: "ENG",
      };
      const teamsMock: TeamModel[] = [
        {
          _id: new ObjectId(),
          idApi: 57,
          name: "Arsenal FC",
          areaName: "England",
          shortName: "Arsenal",
          tla: "ARS",
          address: "75 Drayton Park London N5 1BU",
          competitions: [competitionMock._id]
        },
        {
          _id: new ObjectId(),
          idApi: 58,
          name: "Aston Villa FC",
          areaName: "England",
          shortName: "Aston Villa",
          tla: "AVL",
          address: "Villa Park Birmingham B6 6HE",
          competitions: [competitionMock._id]
        },
        // Add more teams as needed
      ];

      const playersMock: PlayerModel[] =
        [
          {
            _id: new ObjectId(),
            "name": "Vitalii Mykolenko",
            "position": "Defence",
            "dateOfBirth": "1999-05-29",
            "nationality": "Ukraine",
            "teams": [
              teamsMock[0]._id
            ],
          },
          {
            _id: new ObjectId(),
            "name": "Nathan Patterson",
            "position": "Defence",
            "dateOfBirth": "2001-10-16",
            "nationality": "Scotland",
            "teams": [
              teamsMock[0]._id
            ],
          }]

      competitionRepositoryMock.findOneByCode.mockResolvedValue(competitionMock);
      teamRepositoryMock.findByCompetition.mockResolvedValue(teamsMock);
      playerRepositoryMock.findByTeam.mockResolvedValue(playersMock);

      const result = await playerService.getPlayers(leagueCode);

      expect(result).toEqual(playersMock);
    });

    it('should return coaches if no players available', async () => {
      const leagueCode = 'PL';
      const competitionMock = { /* mock competition data */ };
      const teamsMock = [{ /* mock team data */ }];
      const coachesMock = [{ /* mock coach data */ }];

      competitionRepositoryMock.findOneByCode.mockResolvedValue(competitionMock);
      teamRepositoryMock.findByCompetition.mockResolvedValue(teamsMock);
      playerRepositoryMock.findByTeam.mockResolvedValue([]);
      coachRepositoryMock.findByTeam.mockResolvedValue(coachesMock);

      const result = await playerService.getPlayers(leagueCode);

      expect(result).toEqual(coachesMock);
    });

    it('should throw an error if competition not found', async () => {
      const leagueCode = 'PL';

      competitionRepositoryMock.findOneByCode.mockResolvedValue(undefined);

      await expect(playerService.getPlayers(leagueCode)).rejects.toThrow('Competition not found');
    });

    // Add more test cases as needed
  });
});
