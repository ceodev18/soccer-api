import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  health(): string {
    return this.appService.health();
  }
  @Get('/importLeague/:leagueCode')
  async importLeague(@Param('leagueCode') leagueCode: string): Promise<string> {
    return this.appService.importLeague(leagueCode);
  }
}
