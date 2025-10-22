import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { ComprobanteService } from './comprobante.service';
import { Comprobante } from '@prisma/client';
import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { UpdateComprobanteDto } from './dto/update-comprobante.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('tes/admin/comprobantes')
export class ComprobanteController {
  constructor(private readonly comprobanteService: ComprobanteService) {}

  @Post()
  create(@Body() createComprobanteDto: CreateComprobanteDto, comprobante:Comprobante) {
    return this.comprobanteService.create(createComprobanteDto, comprobante);
  }

  @Get()
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
  findAll(@Query() query: any) {
  return this.comprobanteService.findAll(query);
  }


  @Get(':_id')
  findOne(@Param('_id') id: string) {
    return this.comprobanteService.findOne(id);
  }

  @Put()
  update(@Body() updateComprobanteDto: UpdateComprobanteDto) {
    return this.comprobanteService.update(updateComprobanteDto);
  }

  @Delete(':_id')
  remove(@Param('_id') id: string) {
    return this.comprobanteService.remove(id);
  }
}
