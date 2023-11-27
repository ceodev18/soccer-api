import { Module } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { CompetitionController } from './competition.controller';
import { CompetitionRepository } from './competition.repository';
import { Competition, CompetitionSchema } from './entity/competition.model';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnection } from 'src/database/database.connection';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Competition.name, schema: CompetitionSchema }]),
    MongooseModule.forRootAsync({
      useClass: DatabaseConnection,
    }),
  ],
  providers: [CompetitionService, CompetitionRepository],
  controllers: [CompetitionController],
  exports: [CompetitionRepository],
})
export class CompetitionModule {}
