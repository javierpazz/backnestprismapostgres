import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Order } from '@prisma/client';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}



  @Post('rem')
  create(@Body() createInvoiceDto: any) {
    return this.invoiceService.create(createInvoiceDto);
  }

  // @Get('invoices/searchremSEsc')
  // findAll(@Query() query: any) {
  //   return this.invoiceService.findAll(query);
  // }

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

  // @Delete('invoices/:_id/deleteremitEsc')
  // remove(@Param('_id') id: string) {
  //   return this.invoiceService.remove(id);
  // }
}
