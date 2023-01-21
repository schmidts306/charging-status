import { HttpService } from '@nestjs/axios';
export declare class AppService {
    private http;
    constructor(http: HttpService);
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
    getPrevAvailable(): string;
    getAlertStatus(): string;
    saveAvailableStatus(available: string): string;
    sendAlert(prev: string, now: string): void;
}
