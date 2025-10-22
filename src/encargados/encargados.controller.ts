import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { EncargadosService } from './encargados.service';
import { Encargado } from '@prisma/client';
import { CreateEncargadoDto } from './dto/create-encargado.dto';
import { UpdateEncargadoDto } from './dto/update-encargado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('tes/admin/encargados')
export class EncargadosController {
  constructor(private readonly encargadosService: EncargadosService) {}

  @Post()
  create(@Body() createEncargadoDto: CreateEncargadoDto, encargado:Encargado) {
    return this.encargadosService.create(createEncargadoDto, encargado);
  }

  @Get()
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
  findAll() {
    return this.encargadosService.findAll();
  }


  @Get(':_id')
  findOne(@Param('_id') id: string) {
    return this.encargadosService.findOne(id);
  }

  @Put()
  update(@Body() updateEncargadoDto: UpdateEncargadoDto) {
    return this.encargadosService.update(updateEncargadoDto);
  }

  @Delete(':_id')
  remove(@Param('_id') id: string) {
    return this.encargadosService.remove(id);
  }
}
