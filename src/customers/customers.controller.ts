import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
// import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('customers/signup')
  createsignup(@Body() createCustomerDto: any, customer:Customer) {
    return this.customersService.createsignup(createCustomerDto, customer);
  }
  @Post('tes/admin/customers')
  @Auth()
  create(@Body() createCustomerDto: CreateCustomerDto, customer:Customer) {
    return this.customersService.create(createCustomerDto, customer);
  }

  @Get('tes/admin/customers')
  @Auth()
  // findAllAdm( @Query() paginationDto: PaginationDto ) {
  findAll() {
    return this.customersService.findAll();
  }
  @Get('customers')
  @Auth()
  findAllvie() {
    return this.customersService.findAll();
  }


  @Get('tes/admin/customers/:_id')
  @Auth()
  findOne(@Param('_id') id: string) {
    return this.customersService.findOne(id);
  }

  @Get('customers/byemail/:email')
  // @Auth()
  
  findOneEmail(@Param('email') email: string) {
    console.log("email")
    return this.customersService.findOneEmail(email);
  }

  @Put('tes/admin/customers')
  @Auth( ValidRoles.admin )
  update(@Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(updateCustomerDto);
  }

  @Delete('tes/admin/customers/:_id')
  @Auth( ValidRoles.admin )
  remove(@Param('_id') id: string) {
    return this.customersService.remove(id);
  }
}
