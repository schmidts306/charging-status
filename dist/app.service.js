"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const fs = require("fs");
const rxjs_1 = require("rxjs");
let AppService = class AppService {
    constructor(http) {
        this.http = http;
    }
    getHello() {
        return 'Hello World!';
    }
    async getStations() {
        const url = 'https://api.tomtom.com/search/2/poiSearch/charging%20dahlbergstrasse%20aschaffenburg.json?key=bJX8ybLsRAxTax1Ca08q1hYZPNXBf4cw';
        const result = await (0, rxjs_1.lastValueFrom)(this.http.get(url));
        return result.data;
    }
    async getChargingStatus() {
        var _a, _b, _c, _d;
        const stations = await this.getStations();
        const id = (_c = (_b = (_a = stations === null || stations === void 0 ? void 0 : stations.results[0]) === null || _a === void 0 ? void 0 : _a.dataSources) === null || _b === void 0 ? void 0 : _b.chargingAvailability) === null || _c === void 0 ? void 0 : _c.id;
        if (!id)
            return { ok: false, stations };
        const url = 'https://api.tomtom.com/search/2/chargingAvailability.json?key=bJX8ybLsRAxTax1Ca08q1hYZPNXBf4cw&chargingAvailability=' +
            id;
        const result = await (0, rxjs_1.lastValueFrom)(this.http.get(url));
        const connectors = (_d = result.data) === null || _d === void 0 ? void 0 : _d.connectors;
        if (!(connectors === null || connectors === void 0 ? void 0 : connectors.length))
            return { ok: false, result: result.data };
        const available = connectors.reduce((acc, cur) => acc + cur.availability.current.available, 0);
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
    saveAvailableStatus(available) {
        const alertStatus = this.getAlertStatus();
        const statusStr = `alert=${alertStatus};available=${available}`;
        fs.writeFileSync('./status.txt', statusStr);
        return statusStr.split(';')[0].split('=')[1];
    }
    sendAlert(prev, now) {
        const text = `Ladebelegung geändert von ${prev} nach ${now}`;
        const url = 'https://api.callmebot.com/signal/send.php?phone=+4916096456817&apikey=559133&text=' +
            text;
        this.http.get(url).subscribe();
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map