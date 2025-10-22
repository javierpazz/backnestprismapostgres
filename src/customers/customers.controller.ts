import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
// import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('tes/admin/customers')
  create(@Body() createCustomerDto: CreateCustomerDto, customer:Customer) {
    return this.customersService.create(createCustomerDto, customer);
  }

  @Get('tes/admin/customers')
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
  findAll() {
    return this.customersService.findAll();
  }
  @Get('customers')
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
  findAllvie() {
    return this.customersService.findAll();
  }


  @Get('tes/admin/customers/:_id')
  findOne(@Param('_id') id: string) {
    return this.customersService.findOne(id);
  }

  @Put('tes/admin/customers')
  update(@Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(updateCustomerDto);
  }

  @Delete('tes/admin/customers/:_id')
  remove(@Param('_id') id: string) {
    return this.customersService.remove(id);
  }
}
