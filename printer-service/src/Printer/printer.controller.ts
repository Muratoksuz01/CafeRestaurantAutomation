import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Request, Query } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('print')
export class PrinterController {
  constructor(private readonly printerService: PrinterService) { }

  @Post()
  create(@Request() req, @Body() printOrderData: IPrintOrderData) {
    return this.printerService.create(req, printOrderData);
  }

 
  

  
}
