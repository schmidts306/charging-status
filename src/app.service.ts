import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private http: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getStations() {
    const url =
      'https://api.tomtom.com/search/2/poiSearch/charging%20dahlbergstrasse%20aschaffenburg.json?key=bJX8ybLsRAxTax1Ca08q1hYZPNXBf4cw';
    const result = await lastValueFrom(this.http.get(url));
    return result.data;
  }

  async getChargingStatus() {
    const stations = await this.getStations();
    const id = stations?.results[0]?.dataSources?.chargingAvailability?.id;
    if (!id) return { ok: false, stations };
    const url =
      'https://api.tomtom.com/search/2/chargingAvailability.json?key=bJX8ybLsRAxTax1Ca08q1hYZPNXBf4cw&chargingAvailability=' +
      id;
    const result = await lastValueFrom(this.http.get(url));
    const connectors = result.data?.connectors;
    if (!connectors?.length) return { ok: false, result: result.data };
    const available = connectors.reduce(
      (acc, cur) => acc + cur.availability.current.available,
      0,
    );

    const prevAvailable = this.getPrevAvailable();
    if (available.toString() !== prevAvailable) {
      this.saveAvailableStatus(available.toString());
      if (this.getAlertStatus() === 'true') {
        this.sendAlert(prevAvailable, available.toString());
      }
    }
    return { ok: true, available, result: result.data };
  }

  getPrevAvailable() {
    const statusStr = fs.readFileSync('./status.txt', 'utf8');
    return statusStr.split(';')[1].split('=')[1];
  }

  getAlertStatus() {
    const statusStr = fs.readFileSync('./status.txt', 'utf8');
    return statusStr.split(';')[0].split('=')[1];
  }

  saveAvailableStatus(available: string) {
    const alertStatus = this.getAlertStatus();
    const statusStr = `alert=${alertStatus};available=${available}`;
    fs.writeFileSync('./status.txt', statusStr);
    return statusStr.split(';')[0].split('=')[1];
  }

  sendAlert(prev: string, now: string) {
    const text = `Ladebelegung geändert von ${prev} nach ${now}`;
    const url =
      'https://api.callmebot.com/signal/send.php?phone=+4916096456817&apikey=559133&text=' +
      text;
    this.http.get(url).subscribe();
  }
}
