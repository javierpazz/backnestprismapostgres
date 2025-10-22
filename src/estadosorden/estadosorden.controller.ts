import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { EstadosordenService } from './estadosorden.service';
import { StateOrd } from '@prisma/client';
import { CreateEstadosordenDto } from './dto/create-estadosorden.dto';
import { UpdateEstadosordenDto } from './dto/update-estadosorden.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('tes/admin/estadosorden')
export class EstadosordenController {
  constructor(private readonly estadosordenService: EstadosordenService) {}

  @Post()
  create(@Body() createEstadosordenDto: CreateEstadosordenDto, stateOrd:StateOrd) {
    return this.estadosordenService.create(createEstadosordenDto, stateOrd);
  }

  @Get()
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
  findAll() {
    return this.estadosordenService.findAll();
  }


  @Get(':_id')
  findOne(@Param('_id') id: string) {
    return this.estadosordenService.findOne(id);
  }

  @Put()
  update(@Body() updateEstadosordenDto: UpdateEstadosordenDto) {
    return this.estadosordenService.update(updateEstadosordenDto);
  }

  @Delete(':_id')
  remove(@Param('_id') id: string) {
    return this.estadosordenService.remove(id);
  }
}
