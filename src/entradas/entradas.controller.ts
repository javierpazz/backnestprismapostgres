import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { EntradasService } from './entradas.service';
import { Order } from '@prisma/client';
import { CreateEntradaDto } from './dto/create-entrada.dto';
import { UpdateEntradaDto } from './dto/update-entrada.dto';

@Controller()
export class EntradasController {
  constructor(private readonly entradasService: EntradasService) {}

  @Post('invoices/remEsc')
  create(@Body() createEntradaDto: any) {
    console.log(createEntradaDto)
    return this.entradasService.create(createEntradaDto);
  }

  @Get('invoices/searchremSEsc')
  findAll(@Query() query: any) {
    return this.entradasService.findAll(query);
  }

  @Get('invoices/diligencias')
  findAlldil(@Query() query: any) {
    return this.entradasService.findAlldil(query);
  }

  @Get('tes/orders/getorderbyid/:_id')
  findOne(@Param('_id') id: string) {
    return this.entradasService.findOne(id);
  }

  @Put('invoices/remModEsc/:_id')
  update(@Param('_id') id: string, @Body() updateEntradaDto: any) {
    return this.entradasService.update(updateEntradaDto, id as any);
  }

  @Delete('invoices/:_id/deleteremitEsc')
  remove(@Param('_id') id: string) {
    return this.entradasService.remove(id);
  }
}
