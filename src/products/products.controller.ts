import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('tes/admin/productsesc')
  create(@Body() createProductDto: CreateProductDto, product:Product) {
    return this.productsService.create(createProductDto, product);
  }

  @Get('tes/admin/products')
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get('products')
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
  findAllvie(@Query() query: any) {
    return this.productsService.findAll(query);
  }


  @Put('tes/admin/productsesc')
  update(@Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }

  @Delete('tes/admin/productsesc/:_id')
  remove(@Param('_id') id: string) {
    return this.productsService.remove(id);
  }
}
