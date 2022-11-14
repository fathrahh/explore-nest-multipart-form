import { Controller, Get, Param, Query } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getReques(@Query() id) {
    console.log(id);
    return 'hello';
  }
}
