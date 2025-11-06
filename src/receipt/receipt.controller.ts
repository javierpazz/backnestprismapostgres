import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { Receipt } from '@prisma/client';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';


@Controller()
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}


  @Post('receipts')
  @Auth()
  create(@Body() createReceiptDto: any) {
    return this.receiptService.create(createReceiptDto);
  }
  @Post('receipts/caja')
  @Auth()
  createCaj(@Body() createReceiptDto: any) {
    return this.receiptService.createCaj(createReceiptDto);
  }
  
  @Get('receipts/searchrecS')
  @Auth()
  searchrecS(@Query() query: any) {
    return this.receiptService.searchrecS(query);
  }
  @Get('receipts/searchcajS')
  @Auth()
  searchcajS(@Query() query: any) {
    return this.receiptService.searchcajS(query);
  }
  @Get('receipts/searchcajB')
  @Auth()
  searchcajB(@Query() query: any) {
    return this.receiptService.searchcajB(query);
  }
  
  @Get('receipts/searchrecB')
  @Auth()
  searchrecB(@Query() query: any) {
    return this.receiptService.searchrecB(query);
  }
  
  
  @Get('receipts/:_id')
  @Auth()
  findOne(@Param('_id') id: string) {
    return this.receiptService.findOne(id);
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReceiptDto: UpdateReceiptDto) {
  //   return this.receiptService.update(+id, updateReceiptDto);
  // }


  @Delete('receipts/:_id')
  @Auth( ValidRoles.admin )
  remove(@Param('_id') id: string) {
    return this.receiptService.remove(id);
  }

}


