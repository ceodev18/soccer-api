import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FootballApiService } from '../football-api/football-api.service';
import { CoachRepository } from '../player/coach.repository';
import { PlayerRepository } from '../player/player.repository';
import { TeamRepository } from '../team/team.repository';
import { TeamModule } from '../team/team.module';
import { PlayerModule } from '../player/player.module';
import { CompetitionModule } from '../competition/competition.module';
import { CompetitionRepository } from '../competition/competition.repository';
import { getModelToken } from '@nestjs/mongoose';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, 
        FootballApiService, 
        TeamModule, 
        PlayerModule, 
        CompetitionModule, 
        CompetitionRepository,
        TeamRepository,
        PlayerRepository,
        CoachRepository,
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
        {
          provide: getModelToken('Competition'), // Adjust the model name accordingly
          useValue: {}, // Mock the model
        }],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('health', () => {
    it('should return "Healthy!"', () => {
      const result = appController.health();
      expect(result).toBe('App Module is working');
    });
  });

  describe('importLeague', () => {
    it('should call appService.importLeague with the correct leagueCode', async () => {
      const leagueCode = 'someLeagueCode';
      const importLeagueSpy = jest.spyOn(appService, 'importLeague').mockImplementation(() => Promise.resolve('Imported!'));

      const result = await appController.importLeague(leagueCode);

      expect(importLeagueSpy).toHaveBeenCalledWith(leagueCode);
      expect(result).toBe('Imported!');
    });
  });
});
