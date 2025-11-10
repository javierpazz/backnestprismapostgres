import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { EstadosordenService } from './estadosorden.service';
import { StateOrd } from '@prisma/client';
import { CreateEstadosordenDto } from './dto/create-estadosorden.dto';
import { UpdateEstadosordenDto } from './dto/update-estadosorden.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller()
export class EstadosordenController {
  constructor(private readonly estadosordenService: EstadosordenService) {}

  @Post('tes/admin/estadosorden')
  @Auth( ValidRoles.admin )
  create(@Body() createEstadosordenDto: CreateEstadosordenDto, stateOrd:StateOrd) {
    return this.estadosordenService.create(createEstadosordenDto, stateOrd);
  }

  @Get('tes/admin/estadosorden')
  @Auth()
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
    findAll() {
      return this.estadosordenService.findAll();
    }

  @Get('stateOrds')
  @Auth()
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
    findAllVie() {
      return this.estadosordenService.findAll();
    }
    
    
  @Get('tes/admin/estadosorden/:_id')
  @Auth()
  findOne(@Param('_id') id: string) {
    return this.estadosordenService.findOne(id);
  }
  
  @Put('tes/admin/estadosorden')
  @Auth( ValidRoles.admin )
  update(@Body() updateEstadosordenDto: UpdateEstadosordenDto) {
    return this.estadosordenService.update(updateEstadosordenDto);
  }

  @Delete('tes/admin/estadosorden/:_id')
  @Auth( ValidRoles.admin )
  remove(@Param('_id') id: string) {
    return this.estadosordenService.remove(id);
  }
}
