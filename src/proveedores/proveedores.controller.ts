import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { Supplier } from '@prisma/client';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';

@Controller()
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post('tes/admin/proveedores')
  create(@Body() createProveedoreDto: CreateProveedoreDto, supplier:Supplier) {
    return this.proveedoresService.create(createProveedoreDto, supplier);
  }

  @Get('tes/admin/proveedores')
  findAll() {
    return this.proveedoresService.findAll();
  }
  @Get('suppliers')
  findAllvie() {
    return this.proveedoresService.findAll();
  }

  @Get('tes/admin/proveedores/:_id')
  findOne(@Param('_id') id: string) {
    return this.proveedoresService.findOne(id);
  }

 
  @Put('tes/admin/proveedores')
  update(@Body() updateProveedoreDto: UpdateProveedoreDto) {
    return this.proveedoresService.update(updateProveedoreDto);
  }


  @Delete('tes/admin/proveedores/:_id')
  remove(@Param('_id') id: string) {
    return this.proveedoresService.remove(id);
  }
}
