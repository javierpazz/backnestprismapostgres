import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { Supplier } from '@prisma/client';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller()
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post('tes/admin/proveedores')
  @Auth()
  create(@Body() createProveedoreDto: CreateProveedoreDto, supplier:Supplier) {
    return this.proveedoresService.create(createProveedoreDto, supplier);
  }
  
  @Get('tes/admin/proveedores')
  @Auth()
  findAll() {
    return this.proveedoresService.findAll();
  }
  @Get('suppliers')
  @Auth()
  findAllvie() {
    return this.proveedoresService.findAll();
  }
  
  @Get('tes/admin/proveedores/:_id')
  @Auth()
  findOne(@Param('_id') id: string) {
    return this.proveedoresService.findOne(id);
  }
  
  
  @Put('tes/admin/proveedores')
  @Auth( ValidRoles.admin )
  update(@Body() updateProveedoreDto: UpdateProveedoreDto) {
    return this.proveedoresService.update(updateProveedoreDto);
  }


  @Delete('tes/admin/proveedores/:_id')
  @Auth( ValidRoles.admin )
  remove(@Param('_id') id: string) {
    return this.proveedoresService.remove(id);
  }
}
