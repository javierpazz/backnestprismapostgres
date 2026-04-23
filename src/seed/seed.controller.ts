import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller()
export class SeedController {
  constructor(private readonly seedService: SeedService) {}


  @Get('seed')
  executeSeed() {
    return this.seedService.runSeed();
  }
  @Get('seedvinos')
  runSeedVinos() {
    return this.seedService.runSeedVinos();
  }
  @Get('seedservices')
  runSeedServices() {
    return this.seedService.runSeedServices();
  }
  @Get('seedescri')
  runSeedEscri() {
    return this.seedService.runSeedEscri();
  }

}
