import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('stations')
  getStations() {
    return this.appService.getStations();
  }

  @Get('charging-status')
  getChargingStatus() {
    return this.appService.getChargingStatus();
  }

  @Get('alert-on')
  alertOn() {
    return this.appService.setAlert(true);
  }

  @Get('alert-off')
  alertOff() {
    return this.appService.setAlert(false);
  }
}
