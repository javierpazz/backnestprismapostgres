import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { EntradasService } from './entradas.service';
import { Order } from '@prisma/client';
import { CreateEntradaDto } from './dto/create-entrada.dto';
import { UpdateEntradaDto } from './dto/update-entrada.dto';
import { Auth } from 'src/auth/decorators';

@Controller()
export class EntradasController {
  constructor(private readonly entradasService: EntradasService) {}


  @Get('entradas/summary/tar')
  @Auth()
  dashboardTar(@Query() query: any) {
    return this.entradasService.dashboardTar(query);
  }
  @Get('entradas/summary/cli')
  @Auth()
  dashboardCli(@Query() query: any) {
    return this.entradasService.dashboardCli(query);
  }
  @Get('entradas/summary/par')
  @Auth()
  dashboardPar(@Query() query: any) {
    return this.entradasService.dashboardPar(query);
  }
  @Get('entradas/summary/maq')
  @Auth()
  dashboardMaq(@Query() query: any) {
    return this.entradasService.dashboardMaq(query);
  }


  @Get('entradas/summary/esc')
  // async dashboard1(@Query() query: any) {
  @Auth()
  dashboardEsc(@Query() query: any) {
    return this.entradasService.dashboardEsc(query);
  }



  @Put('entradas/:Id/applychasta')
  @Auth()
  applychasta(@Param('Id') id: string, @Body() updateInvoiceDto: any) {
    return this.entradasService.applychasta(updateInvoiceDto, id as any);
  }

  @Get('tes/entradas/getservicesbyus/:_id')
  @Auth()
  searchSerUS(@Param('_id') id: string) {
    return this.entradasService.searchSerUS(id);
  }



  @Post('entradas/remEsc')
  @Auth()
  create(@Body() createEntradaDto: any) {
    return this.entradasService.create(createEntradaDto);
  }

  @Get('entradas/searchremSEsc')
  @Auth()
  findAll(@Query() query: any) {
    return this.entradasService.findAll(query);
  }
  
  @Get('entradas/diligencias')
  @Auth()
  findAlldil(@Query() query: any) {
    return this.entradasService.findAlldil(query);
  }
  
  // @Get('tes/orders/getorderbyid/:_id')
  // @Auth()
  // findOne(@Param('_id') id: string) {
  //   return this.entradasService.findOne(id);
  // }

  @Get('tes/entradas/getorderbyid/:_id')
  @Auth()
  findOneSer(@Param('_id') id: string) {
    return this.entradasService.findOneSer(id);
  }
  
  @Put('entradas/remModEsc/:_id')
  @Auth()
  update(@Param('_id') id: string, @Body() updateEntradaDto: any) {
    return this.entradasService.update(updateEntradaDto, id as any);
  }
  
  @Delete('entradas/:_id/deleteremitEsc')
  @Auth()
  remove(@Param('_id') id: string) {
    return this.entradasService.remove(id);
  }
}
