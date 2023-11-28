import { Test, TestingModule } from '@nestjs/testing';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';
import { PlayerRepository } from '../player/player.repository';
import { CoachRepository } from '../player/coach.repository';
import { getModelToken } from '@nestjs/mongoose';

describe('TeamController', () => {
  let teamController: TeamController;
  let teamService: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [TeamService, TeamRepository,
        {
          provide: getModelToken('Team'), // Adjust the model name accordingly
          useValue: {}, // Mock the model
        },
        {
          provide: getModelToken('Player'), 
          useValue: {}, 
        },
        {
          provide: getModelToken('Coach'), // Adjust the model name accordingly
          useValue: {}, // Mock the model
        },
         PlayerRepository, CoachRepository],
    }).compile();

    teamController = module.get<TeamController>(TeamController);
    teamService = module.get<TeamService>(TeamService);
  });

  describe('getTeamByName', () => {
    it('should call getTeamByName from TeamService and return the result', async () => {
      const teamName = 'Everton FC';
      const teamMockResult =
      {
        "team": {
          "_id": "65661ec8f949e812805ba41d",
          "idApi": 62,
          "name": "Everton FC",
          "tla": "EVE",
          "shortName": "Everton",
          "areaName": "England",
          "address": "Goodison Park Liverpool L4 4EL",
          "competitions": [
            "65661ec7f949e812805ba3fc"
          ],
          "__v": 0
        },
        "players": [
          {
            "_id": "65661ec9f949e812805ba7cf",
            "name": "Andy Lonergan",
            "position": "Goalkeeper",
            "dateOfBirth": "1983-10-19",
            "nationality": "England",
            "teams": [
              "65661ec8f949e812805ba41d"
            ],
            "__v": 0
          },
          {
            "_id": "65661ec9f949e812805ba7d1",
            "name": "João Virgínia",
            "position": "Goalkeeper",
            "dateOfBirth": "1999-10-10",
            "nationality": "Portugal",
            "teams": [
              "65661ec8f949e812805ba41d"
            ],
            "__v": 0
          },
        ]
      }

      jest.spyOn(teamService, 'getTeamByName').mockResolvedValue(teamMockResult);

      const result = await teamController.getTeamByName(teamName);

      expect(result).toEqual(teamMockResult);
      expect(teamService.getTeamByName).toHaveBeenCalledWith(teamName);
    });
  });
});
