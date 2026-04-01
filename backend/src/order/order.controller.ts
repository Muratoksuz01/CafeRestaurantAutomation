import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Request, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(req, createOrderDto);
  }

 @Get()
  async findAll(
    @Query('from') from?: string, 
    @Query('to') to?: string
  ) {
  console.log("burada:",from)
  console.log("burada:",to)
    return await this.orderService.findAll(from, to);
  }
  @Put("editOrder")
  async editOrder(@Body() updateOrderDto: UpdateOrderDto) {
    return await this.orderService.editOrder(updateOrderDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
  @Post("paidOrder")
  async paidOrder(@Body() updateOrderDto: UpdateOrderDto) {
    return await this.orderService.getPaid(updateOrderDto)
  }
  // @Post("getOrders/by-date")
  // async getOrderByDate(from?: string, to?: string) {
  //   return await this.orderService.getOrderByDate(from, to)
  // }
  @Get("print/:id")
  async  printAdisyon(@Param("id") id :string) {
    return await this.orderService.printOrder(id)
  }
  
}
