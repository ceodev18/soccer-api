import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PlayerModel } from './entity/player.model';
import { Competition } from '../competition/entity/competition.model';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { CompetitionRepository } from '../competition/competition.repository';

describe('PlayerController', () => {
  let playerController: PlayerController;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [PlayerService],
    }).compile();

    playerController = module.get<PlayerController>(PlayerController);
    playerService = module.get<PlayerService>(PlayerService);
  });

  describe('getPlayers', () => {
    it('should return an array of players or coaches', async () => {
      // Mock the service response
      const competition: Competition = {
        "_id": new ObjectId(),
        "name": "Premier League",
        "code": "PL",
        "areaCode": "ENG",

      }
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

      jest.spyOn(playerService, 'getPlayers').mockResolvedValue(mockPlayersOrCoaches);

      // Call the controller method
      const result = await playerController.getPlayers('PL');

      // Assert the result
      expect(result).toEqual(mockPlayersOrCoaches);
    });
  });
});
