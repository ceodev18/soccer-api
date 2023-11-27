import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('health', () => {
    it('should return "Healthy!"', () => {
      const result = appController.health();
      expect(result).toBe('Healthy!');
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
