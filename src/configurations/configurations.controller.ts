import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';
import { Configuration } from '@prisma/client';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from 'src/auth/decorators';

@Controller()
export class ConfigurationsController {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  @Post('tes/admin/configuraciones')
  @Auth( ValidRoles.admin )
  create(@Body() createConfigurationDto: CreateConfigurationDto, configuration:Configuration) {
    return this.configurationsService.create(createConfigurationDto, configuration);
  }

  @Get('tes/admin/configuraciones')
  @Auth()
  findAlladm() {
    const configurations = this.configurationsService.findAlladm();
    return configurations;
  }
 
  @Get('configurations/admin')
  @Auth()
  findAll() {
    const configurations = this.configurationsService.findAll();
    return configurations;
  }

  @Get('configurations')
  findAllV() {
    const configurations = this.configurationsService.findAllV();
    return configurations;
  }

  @Get('tes/admin/configuraciones/:id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.configurationsService.findOne(id);
  }

  @Put('tes/admin/configuraciones')
  @Auth( ValidRoles.admin )
  update(@Body() updateConfigurationDto: UpdateConfigurationDto) {
    return this.configurationsService.update(updateConfigurationDto);
  }

  @Delete('tes/admin/configuraciones/:id')
  @Auth( ValidRoles.admin )
  remove(@Param('id') id: string) {
    return this.configurationsService.remove(id);
  }
}
