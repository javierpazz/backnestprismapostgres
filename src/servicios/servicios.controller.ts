// import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
// import { EntradasService } from './entradas.service';
// import { Order } from '@prisma/client';
// import { CreateEntradaDto } from './dto/create-entrada.dto';
// import { UpdateEntradaDto } from './dto/update-entrada.dto';
// import { Auth } from 'src/auth/decorators';


// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { Service } from '@prisma/client';
import { Auth } from 'src/auth/decorators';

@Controller()
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}



  @Get('entradas/summary/tra')
  @Auth()
  dashboardTra(@Query() query: any) {
    return this.serviciosService.dashboardTra(query);
  }
  @Get('entradas/summary/tar')
  @Auth()
  dashboardTar(@Query() query: any) {
    return this.serviciosService.dashboardTar(query);
  }
  @Get('entradas/summary/par')
  @Auth()
  dashboardPar(@Query() query: any) {
    return this.serviciosService.dashboardPar(query);
  }
  @Get('entradas/summary/maq')
  @Auth()
  dashboardMaq(@Query() query: any) {
    return this.serviciosService.dashboardMaq(query);
  }




}
