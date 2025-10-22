import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { ValoresService } from './valores.service';
import { Valuee } from '@prisma/client';
import { CreateValoreDto } from './dto/create-valore.dto';
import { UpdateValoreDto } from './dto/update-valore.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller()
export class ValoresController {
  constructor(private readonly valoresService: ValoresService) {}

  @Post('tes/admin/valores')
  create(@Body() createValueeDto: CreateValoreDto, Valuee:Valuee) {
    return this.valoresService.create(createValueeDto, Valuee);
  }

  @Get('tes/admin/valores')
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
  findAll() {
    return this.valoresService.findAll();
  }
  @Get('valuees')
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
  findAllvie() {
    return this.valoresService.findAll();
  }


  @Get('tes/admin/valores/:_id')
  findOne(@Param('_id') id: string) {
    return this.valoresService.findOne(id);
  }

  @Put('tes/admin/valores')
  update(@Body() updateValoreDto: UpdateValoreDto) {
    return this.valoresService.update(updateValoreDto);
  }

  @Delete('tes/admin/valores/:_id')
  remove(@Param('_id') id: string) {
    return this.valoresService.remove(id);
  }
}
