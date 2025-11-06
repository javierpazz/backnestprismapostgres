import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { InstrumentosService } from './instrumentos.service';
import { Instrumento } from '@prisma/client';
import { CreateInstrumentoDto } from './dto/create-instrumento.dto';
import { UpdateInstrumentoDto } from './dto/update-instrumento.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateParamsDto } from './dto/create-params.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller()
export class InstrumentosController {
  constructor(private readonly instrumentosService: InstrumentosService) {}

@Put('tes/admin/instrumentos/det')
@Auth()
  updateDet(@Body() createParamsDto: any) {
    return this.instrumentosService.updateDet(createParamsDto);
  }


  @Post('tes/admin/instrumentos')
  @Auth()
  create(@Body() createInstrumentoDto: CreateInstrumentoDto, instrumento:Instrumento) {
    return this.instrumentosService.create(createInstrumentoDto, instrumento);
  }
  
  @Get('tes/admin/instrumentos')
  @Auth()
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
    findAll() {
      return this.instrumentosService.findAll();
    }
    
    
  @Get('tes/admin/instrumentos/:_id')
  @Auth()
  findOne(@Param('_id') id: string) {
    return this.instrumentosService.findOne(id);
  }
  
  @Put('tes/admin/instrumentos')
  @Auth()
  update(@Body() updateInstrumentoDto: UpdateInstrumentoDto) {
    return this.instrumentosService.update(updateInstrumentoDto);
  }
  
  @Delete('tes/admin/instrumentos/:_id')
  @Auth()
  remove(@Param('_id') id: string) {
    return this.instrumentosService.remove(id);
  }}
