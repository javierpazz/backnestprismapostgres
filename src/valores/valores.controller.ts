import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { ValoresService } from './valores.service';
import { Valuee } from '@prisma/client';
import { CreateValoreDto } from './dto/create-valore.dto';
import { UpdateValoreDto } from './dto/update-valore.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('tes/admin/valores')
export class ValoresController {
  constructor(private readonly valoresService: ValoresService) {}

  @Post()
  create(@Body() createValueeDto: CreateValoreDto, Valuee:Valuee) {
    return this.valoresService.create(createValueeDto, Valuee);
  }

  @Get()
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
  findAll() {
    return this.valoresService.findAll();
  }


  @Get(':_id')
  findOne(@Param('_id') id: string) {
    return this.valoresService.findOne(id);
  }

  @Put()
  update(@Body() updateValoreDto: UpdateValoreDto) {
    return this.valoresService.update(updateValoreDto);
  }

  @Delete(':_id')
  remove(@Param('_id') id: string) {
    return this.valoresService.remove(id);
  }
}
