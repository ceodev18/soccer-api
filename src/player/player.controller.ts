import { Controller, Get, Param } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player, PlayerModel } from './entity/player.model';
import { ApiTags } from '@nestjs/swagger';
import { CoachModel } from 'src/team/entity/team.model';

@ApiTags('players')
@Controller('players')
export class PlayerController {
    constructor(private readonly playerService: PlayerService) {}
    
    @Get('/:leagueCode')
    async getPlayers(@Param('leagueCode') leagueCode: string): Promise<(PlayerModel | CoachModel)[]> {
        return this.playerService.getPlayers(leagueCode);
    }
}
