import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('healthy')
  status() {
    return { status: 'healthy' };
  }
}
