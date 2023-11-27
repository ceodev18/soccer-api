import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnection } from './database.connection'; // Adjust the path

@Module({
  imports: [MongooseModule.forRootAsync({ useClass: DatabaseConnection })],
  exports: [MongooseModule],
})
export class DatabaseModule {}
