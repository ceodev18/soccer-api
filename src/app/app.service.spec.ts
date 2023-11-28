import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { FootballApiService } from '../football-api/football-api.service';
import { Competition } from 'src/competition/entity/competition.model';
import { Team } from 'src/team/entity/team.model';

describe('AppService', () => {
    let appService: AppService;
    let footballApiServiceMock: jest.Mocked<FootballApiService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppService,
                {
                    provide: FootballApiService,
                    useFactory: () => ({
                        getCompetition: jest.fn(),
                        getTeams: jest.fn(),
                        getPlayers: jest.fn(),
                    }),
                },
            ],
        }).compile();

        appService = module.get<AppService>(AppService);
        footballApiServiceMock = module.get(FootballApiService) as jest.Mocked<FootballApiService>;
    });

    describe('health', () => {
        it('should return a string', () => {
            const result = appService.health();
            expect(result).toBe('App Module is working');
        });
    });

    describe('importLeague', () => {
        it('should import a league', async () => {
            // Mock the necessary methods from FootballApiService
            const competition:Competition = {
                name: "Premier League",
                code: "PL",
                areaCode: "ENG",
            };
            const teamData: Team[] = [
                {
                    idApi: 57,
                    name: "Arsenal FC",
                    areaName:"England",
                    shortName: "Arsenal",
                    tla: "ARS",
                    address: "75 Drayton Park London N5 1BU",
                    competitions:[]
                },
                {
                    idApi: 58,
                    name: "Aston Villa FC",
                    areaName:"England",
                    shortName: "Aston Villa",
                    tla: "AVL",
                    address: "Villa Park Birmingham B6 6HE",
                    competitions:[]
                }
                // Add more teams as needed
            ];

            footballApiServiceMock.getCompetition.mockResolvedValue(competition);
            footballApiServiceMock.getTeams.mockResolvedValue(teamData);
            footballApiServiceMock.getPlayers.mockResolvedValue(undefined);

            const leagueCode = 'PL';
            const result = await appService.importLeague(leagueCode);

            expect(result).toBe(`Importing League ${leagueCode}`);
            // Add additional expectations as needed
        });
    });
});
