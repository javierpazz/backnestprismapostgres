import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Order } from '@prisma/client';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}



  @Post('invoices')
  createInv(@Body() createInvoiceDto: any) {
    return this.invoiceService.createInv(createInvoiceDto);
  }

  @Post('invoices/rem')
  createRem(@Body() createInvoiceDto: any) {
    return this.invoiceService.createRem(createInvoiceDto);
  }

  @Post('invoices/mov')
  createMov(@Body() createInvoiceDto: any) {
    return this.invoiceService.createMov(createInvoiceDto);
  }

  @Get('invoices/searchinvS')
  searchinvS(@Query() query: any) {
    return this.invoiceService.searchinvS(query);
  }
  @Get('invoices/searchinvB')
  searchinvB(@Query() query: any) {
    return this.invoiceService.searchinvB(query);
  }
  @Get('invoices/searchremS')
  searchremS(@Query() query: any) {
    return this.invoiceService.searchremS(query);
  }

  @Get('invoices/searchremB')
  searchremB(@Query() query: any) {
    return this.invoiceService.searchremB(query);
  }

  @Get('invoices/searchmovS')
  searchmovS(@Query() query: any) {
    return this.invoiceService.searchmovS(query);
  }
  @Get('invoices/searchmovB')
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

  // @Put('invoices/remModEsc/:_id')
  // update(@Param('_id') id: string, @Body() updateEntradaDto: any) {
  //   return this.invoiceService.update(updateEntradaDto, id as any);
  // }

  @Delete('invoices/:_id')
  remove(@Param('_id') id: string) {
    return this.invoiceService.remove(id);
  }
}
