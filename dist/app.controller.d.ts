import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getStations(): Promise<any>;
    getChargingStatus(): Promise<{
        ok: boolean;
        stations: any;
        result?: undefined;
        available?: undefined;
    } | {
        ok: boolean;
        result: any;
        stations?: undefined;
        available?: undefined;
    } | {
        ok: boolean;
        available: any;
        result: any;
        stations?: undefined;
    }>;
}
