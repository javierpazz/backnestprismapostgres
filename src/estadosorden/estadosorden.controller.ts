import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { EstadosordenService } from './estadosorden.service';
import { StateOrd } from '@prisma/client';
import { CreateEstadosordenDto } from './dto/create-estadosorden.dto';
import { UpdateEstadosordenDto } from './dto/update-estadosorden.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('tes/admin/estadosorden')
export class EstadosordenController {
  constructor(private readonly estadosordenService: EstadosordenService) {}

  @Post()
  @Auth( ValidRoles.admin )
  create(@Body() createEstadosordenDto: CreateEstadosordenDto, stateOrd:StateOrd) {
    return this.estadosordenService.create(createEstadosordenDto, stateOrd);
  }

  @Get()
  @Auth()
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
    findAll() {
      return this.estadosordenService.findAll();
    }
    
    
  @Get(':_id')
  @Auth()
  findOne(@Param('_id') id: string) {
    return this.estadosordenService.findOne(id);
  }
  
  @Put()
  @Auth( ValidRoles.admin )
  update(@Body() updateEstadosordenDto: UpdateEstadosordenDto) {
    return this.estadosordenService.update(updateEstadosordenDto);
  }

  @Delete(':_id')
  @Auth( ValidRoles.admin )
  remove(@Param('_id') id: string) {
    return this.estadosordenService.remove(id);
  }
}
