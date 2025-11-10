import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Order } from '@prisma/client';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}
  
  
  
  @Post('invoices')
  @Auth()
  createInv(@Body() createInvoiceDto: any) {
    return this.invoiceService.createInv(createInvoiceDto);
  }
  
  @Post('invoices/rem')
  @Auth()
  createRem(@Body() createInvoiceDto: any) {
    return this.invoiceService.createRem(createInvoiceDto);
  }

  @Post('tes/orders')
  @Auth()
  createOrd(@Body() createInvoiceDto: any) {
    return this.invoiceService.createOrd(createInvoiceDto);
  }
  
  @Post('invoices/mov')
  @Auth()
  createMov(@Body() createInvoiceDto: any) {
    return this.invoiceService.createMov(createInvoiceDto);
  }
  
  @Get('invoices/searchinvS')
  @Auth()
  searchinvS(@Query() query: any) {
    return this.invoiceService.searchinvS(query);
  }
  @Get('invoices/searchinvB')
  @Auth()
  searchinvB(@Query() query: any) {
    return this.invoiceService.searchinvB(query);
  }
  @Get('invoices/searchremS')
  @Auth()
  searchremS(@Query() query: any) {
    return this.invoiceService.searchremS(query);
  }
  
  @Get('invoices/searchremB')
  @Auth()
  searchremB(@Query() query: any) {
    return this.invoiceService.searchremB(query);
  }

  @Get('tes/admin/orders')
  @Auth()
  searchOrds(@Query() query: any) {
    return this.invoiceService.searchOrds(query);
  }

  @Get('tes/orders/getordersbyus/:_id')
  @Auth()
  searchOrdUS(@Param('_id') id: string) {
    return this.invoiceService.searchOrdUS(id);
  }
  
  
  @Get('invoices/searchmovS')
  @Auth()
  searchmovS(@Query() query: any) {
    return this.invoiceService.searchmovS(query);
  }
  @Get('invoices/searchmovB')
  @Auth()
  searchmovB(@Query() query: any) {
    return this.invoiceService.searchmovB(query);
  }
  
  // @Get('invoices/diligencias')
  // findAlldil(@Query() query: any) {
    //   return this.invoiceService.findAlldil(query);
    // }
    
    // @Get('tes/orders/getorderbyid/:_id')
    // findOne(@Param('_id') id: string) {
      //   return this.invoiceService.findOne(id);
      // }
      
  @Put('invoices/:_id/geninvRem')
  @Auth()
  geninvRem(@Param('_id') id: string, @Body() updateInvoiceDto: any) {
    return this.invoiceService.geninvRem(updateInvoiceDto, id as any);
  }

  @Put('invoices/:_id/deleteremit')
  @Auth( ValidRoles.admin )
  deleteremit(@Param('_id') id: string, @Body() updateInvoiceDto: any) {
    return this.invoiceService.nullremit(updateInvoiceDto, id as any);
  }

  @Put('invoices/:_id/deleteinvoice')
  @Auth( ValidRoles.admin )
  deleteinvoice(@Param('_id') id: string, @Body() updateInvoiceDto: any) {
    return this.invoiceService.nullinvoice(updateInvoiceDto, id as any);
  }

  @Put('invoices/:_id/unapplyrecS')
  @Auth( ValidRoles.admin )
  updateS(@Param('_id') id: string, @Body() updateInvoiceDto: any) {
    return this.invoiceService.updateS(updateInvoiceDto, id as any);
  }

  @Put('invoices/:_id/unapplyrecB')
  @Auth( ValidRoles.admin )
  updateB(@Param('_id') id: string, @Body() updateInvoiceDto: any) {
    return this.invoiceService.updateB(updateInvoiceDto, id as any);
  }

  @Delete('invoices/:_id')
  @Auth( ValidRoles.admin )
  remove(@Param('_id') id: string) {
    return this.invoiceService.remove(id);
  }
  @Delete('orders/:_id')
  @Auth( ValidRoles.admin )
  removeOrd(@Param('_id') id: string) {
    return this.invoiceService.remove(id);
  }
}
