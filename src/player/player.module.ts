import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { PlayerRepository } from './player.repository';
import { Player, PlayerSchema } from './entity/player.model';
import { TeamRepository } from 'src/team/team.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnection } from 'src/database/database.connection';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
    MongooseModule.forRootAsync({
      useClass: DatabaseConnection,
    }),
  ],
  providers: [PlayerService, PlayerRepository],
  controllers: [PlayerController],
  exports:[PlayerRepository]
})
export class PlayerModule {}

