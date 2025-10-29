import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { Receipt } from '@prisma/client';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';


@Controller()
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}


  @Post('receipts')
  create(@Body() createReceiptDto: any) {
    return this.receiptService.create(createReceiptDto);
  }
  @Post('receipts/caja')
  createCaj(@Body() createReceiptDto: any) {
    return this.receiptService.createCaj(createReceiptDto);
  }

  @Get('receipts/searchrecS')
  searchrecS(@Query() query: any) {
    return this.receiptService.searchrecS(query);
  }
  @Get('receipts/searchcajS')
  searchcajS(@Query() query: any) {
    return this.receiptService.searchcajS(query);
  }
  @Get('receipts/searchcajB')
  searchcajB(@Query() query: any) {
    return this.receiptService.searchcajB(query);
  }

  @Get('receipts/searchrecB')
  searchrecB(@Query() query: any) {
    return this.receiptService.searchrecB(query);
  }


  @Get('receipts/:_id')
  findOne(@Param('_id') id: string) {
    return this.receiptService.findOne(id);
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReceiptDto: UpdateReceiptDto) {
  //   return this.receiptService.update(+id, updateReceiptDto);
  // }


  @Delete('receipts/:_id')
  remove(@Param('_id') id: string) {
    return this.receiptService.remove(id);
  }

}


