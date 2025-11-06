import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { PartesService } from './partes.service';
import { Parte } from '@prisma/client';
import { CreateParteDto } from './dto/create-parte.dto';
import { UpdateParteDto } from './dto/update-parte.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('tes/admin/partes')
export class PartesController {
  constructor(private readonly partesService: PartesService) {}

  @Post()
  @Auth( ValidRoles.admin )
  create(@Body() createParteDto: CreateParteDto, parte:Parte) {
    return this.partesService.create(createParteDto, parte);
  }

  @Get()
  @Auth()
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
    findAll() {
      return this.partesService.findAll();
    }
    
    
  @Get(':_id')
  @Auth()
  findOne(@Param('_id') id: string) {
    return this.partesService.findOne(id);
  }

  @Put()
  @Auth( ValidRoles.admin )
  update(@Body() updateParteDto: UpdateParteDto) {
    return this.partesService.update(updateParteDto);
  }

  @Delete(':_id')
  @Auth( ValidRoles.admin )
  remove(@Param('_id') id: string) {
    return this.partesService.remove(id);
  }
}
