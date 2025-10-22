import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';
import { Configuration } from '@prisma/client';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller()
export class ConfigurationsController {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  @Post('tes/admin/configuraciones')
  create(@Body() createConfigurationDto: CreateConfigurationDto, configuration:Configuration) {
    return this.configurationsService.create(createConfigurationDto, configuration);
  }

  @Get('tes/admin/configuraciones')
  findAlladm() {
    const configurations = this.configurationsService.findAlladm();
    return configurations;
  }
 
  @Get('configurations/admin')
  findAll() {
    const configurations = this.configurationsService.findAll();
    return configurations;
  }

  @Get('tes/admin/configuraciones/:id')
  findOne(@Param('id') id: string) {
    return this.configurationsService.findOne(id);
  }

  @Put('tes/admin/configuraciones')
  update(@Body() updateConfigurationDto: UpdateConfigurationDto) {
    return this.configurationsService.update(updateConfigurationDto);
  }

  @Delete('tes/admin/configuraciones/:id')
  remove(@Param('id') id: string) {
    return this.configurationsService.remove(id);
  }
}
