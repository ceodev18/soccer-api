import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TeamService } from './team.service';

@ApiTags('teams')
@Controller('teams')
export class TeamController {
    constructor(private readonly playerService: TeamService) {}

    @Get('/:name')
    async getTeamByName(@Param('name') name: string): Promise<any> {
        return this.playerService.getTeamByName(name);
    }
}
