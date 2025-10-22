import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { PartesService } from './partes.service';
import { Parte } from '@prisma/client';
import { CreateParteDto } from './dto/create-parte.dto';
import { UpdateParteDto } from './dto/update-parte.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('tes/admin/partes')
export class PartesController {
  constructor(private readonly partesService: PartesService) {}

  @Post()
  create(@Body() createParteDto: CreateParteDto, parte:Parte) {
    return this.partesService.create(createParteDto, parte);
  }

  @Get()
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
  findAll() {
    return this.partesService.findAll();
  }


  @Get(':_id')
  findOne(@Param('_id') id: string) {
    return this.partesService.findOne(id);
  }

  @Put()
  update(@Body() updateParteDto: UpdateParteDto) {
    return this.partesService.update(updateParteDto);
  }

  @Delete(':_id')
  remove(@Param('_id') id: string) {
    return this.partesService.remove(id);
  }
}
