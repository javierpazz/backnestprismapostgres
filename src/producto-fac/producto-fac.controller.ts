import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { ProductoFacService } from './producto-fac.service';
import { Product } from '@prisma/client';
import { CreateProductoFacDto } from './dto/create-producto-fac.dto';
import { UpdateProductoFacDto } from './dto/update-producto-fac.dto';




@Controller()
export class ProductoFacController {
  constructor(private readonly productoFacService: ProductoFacService) {}

  @Post('tes/admin/productsfac')
  create(@Body() createProductoFacDto: CreateProductoFacDto, product:Product) {
    return this.productoFacService.create(createProductoFacDto, product);
  }

  @Get('products/admin/tes')
  findAll(@Query() query: any) {
    return this.productoFacService.findAll(query);
  }
  @Get('/products/xpv')
  findAllvie(@Query() query: any) {
    return this.productoFacService.findAll(query);
  }



  @Get('tes/products/:_id')
  findOne(@Param('_id') id: string) {

    return this.productoFacService.findOne(id);
  }

  @Put('products/downstock/:_id')
  downstock(@Param('_id') id: string,
  @Body() updateProductDto: any
  ) {
    return this.productoFacService.downstock(id, updateProductDto);
  }

  @Put('products/upstock/:_id')
  upstock(@Param('_id') id: string,
  @Body() updateProductDto: any
  ) {
    return this.productoFacService.upstock(id, updateProductDto);
  }

  @Put('tes/admin/productsfac')
  update(@Body() updateProductDto: UpdateProductoFacDto) {
  // update(@Body() updateProductDto: any) {
    console.log(updateProductDto)
    return this.productoFacService.update(updateProductDto);
  }

  // @Delete('tes/admin/productsesc/:_id')
  // remove(@Param('_id') id: string) {
  //   return this.productoFacService.remove(id);
  // }
}
