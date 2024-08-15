import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/start')
  start()  {
    return this.appService.start();
  }

  @Get('')
  test()  {
    return this.appService.test();
  }
}
