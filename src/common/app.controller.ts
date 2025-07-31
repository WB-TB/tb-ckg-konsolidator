import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({ description: 'Mengembalikan "OK" jika layanan berjalan dengan baik.' })
  getHealthcheck(): string {
    return this.appService.getHealthcheck();
  }
}
