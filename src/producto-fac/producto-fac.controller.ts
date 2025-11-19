import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { ProductoFacService } from './producto-fac.service';
import { Product } from '@prisma/client';
import { CreateProductoFacDto } from './dto/create-producto-fac.dto';
import { UpdateProductoFacDto } from './dto/update-producto-fac.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';




@Controller()
export class ProductoFacController {
  constructor(private readonly productoFacService: ProductoFacService) {}

  @Post('tes/admin/productsfac')
  @Auth( ValidRoles.admin )
  createFac(@Body() createProductoFacDto: CreateProductoFacDto, product:Product) {
    return this.productoFacService.createFac(createProductoFacDto, product);
  }

  @Post('tes/admin/products')
  @Auth( ValidRoles.admin )
  create(@Body() createProductoFacDto: CreateProductoFacDto, product:Product) {
    return this.productoFacService.create(createProductoFacDto, product);
  }

  @Get('products/admin/tes')
  findAll(@Query() query: any) {
    return this.productoFacService.findAll(query);
  }
  @Get('products/categories')
  findAllCat(@Query() query: any) {
    return this.productoFacService.findAllCat(query);
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
  @Auth()
  dispre(@Query() query: any)
{
  return this.productoFacService.dispre(query);
}

  @Put('products/downstock/:_id')
  @Auth()
  downstock(@Param('_id') id: string,
  @Body() updateProductDto: any
) {
  return this.productoFacService.downstock(id, updateProductDto);
}

  @Put('products/upstock/:_id')
  @Auth()
  upstock(@Param('_id') id: string,
  @Body() updateProductDto: any
  ) {
    return this.productoFacService.upstock(id, updateProductDto);
  }

  @Put('tes/admin/productsfac')
  @Auth( ValidRoles.admin )
  updateFac(@Body() updateProductoFacDto: UpdateProductoFacDto) {
  // update(@Body() updateProductoFacDto: any) {
    console.log(updateProductoFacDto)
    return this.productoFacService.updateFac(updateProductoFacDto);
  }
  @Put('tes/admin/products')
  @Auth( ValidRoles.admin )
  update(@Body() updateProductoFacDto: UpdateProductoFacDto) {
  // update(@Body() updateProductoFacDto: any) {
    console.log(updateProductoFacDto)
    return this.productoFacService.update(updateProductoFacDto);
  }

  // @Delete('tes/admin/productsesc/:_id')
  // @Auth( ValidRoles.admin )
  // remove(@Param('_id') id: string) {
  //   return this.productoFacService.remove(id);
  // }
}
