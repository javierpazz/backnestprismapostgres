import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { Maquina } from '@prisma/client';

import { MaquinasService } from './maquinas.service';
import { CreateMaquinaDto } from './dto/create-maquina.dto';
import { UpdateMaquinaDto } from './dto/update-maquina.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
// @Controller('maquinas')
// export class MaquinasController {
//   constructor(private readonly maquinasService: MaquinasService) {}

//   @Post()
//   create(@Body() createMaquinaDto: CreateMaquinaDto) {
//     return this.maquinasService.create(createMaquinaDto);
//   }

@Controller('tes/admin/maquinas')
export class MaquinasController {
  constructor(private readonly maquinasService: MaquinasService) {}

  @Post()
  @Auth( ValidRoles.admin )
  create(@Body() createMaquinaDto: CreateMaquinaDto, maquina:Maquina) {
    return this.maquinasService.create(createMaquinaDto, maquina);
  }
  
  @Get('/mpcliente')
  findAllmpc(@Query() query: any) {
    return this.maquinasService.findAllmpc(query);
  }


  @Get()
  @Auth()
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
    findAll(@Query() query: any) {
    return this.maquinasService.findAll(query);
  }


  @Get(':_id')
  @Auth()
  findOne(@Param('_id') id: string) {
    return this.maquinasService.findOne(id);
  }

  @Put()
  @Auth( ValidRoles.admin )
  update(@Body() updateMaquinaDto: UpdateMaquinaDto) {
    return this.maquinasService.update(updateMaquinaDto);
  }

  @Delete(':_id')
  @Auth( ValidRoles.admin )
  remove(@Param('_id') id: string) {
    return this.maquinasService.remove(id);
  }
}

