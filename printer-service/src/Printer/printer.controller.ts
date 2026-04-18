import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Request, Query } from '@nestjs/common';
import { PrinterService } from './printer.service';
import type { IPrintOrderData } from './dto/adisyonModel';
@Controller('print')
export class PrinterController {
  constructor(private readonly printerService: PrinterService) { }

  // @Post()
  // printOrder(@Request() req, @Body() printOrderData: IPrintOrderData) {
  //   return this.printerService.printOrder(printOrderData);
  // }

 @Get()
 findAll(){
  return this.printerService.findAll()
 }
  

  
}
