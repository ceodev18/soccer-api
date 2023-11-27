import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnection } from 'src/database/database.connection';
import { Team, TeamSchema } from './entity/team.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    MongooseModule.forRootAsync({
      useClass: DatabaseConnection,
    }),
  ],
  providers: [TeamService, TeamRepository],
  controllers: [TeamController],
  exports: [TeamRepository],
})
export class TeamModule {}
